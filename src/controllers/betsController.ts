import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Bet } from "../models/bets.model";
import { Role } from "../models/role.model";
import mongoose from "mongoose";

// POST /api/bets
export const createBet = async (req: Request, res: Response) => {
     const session = await mongoose.startSession();
     session.startTransaction();

     try {
          const userId = (req as any).user?.id;
          if (!userId) {
               return res.status(401).json({ message: "Unauthorized" });
          }

          const { matchId, teamId, rate, tokenAmount, type, betType } = req.body;

          // Validate request body
          if (!matchId || !teamId || !rate || !tokenAmount || !type || !betType) {
               return res.status(400).json({ message: "Missing required fields" });
          }

          // Find user (need tokens + fullName)
          const user = await User.findById(userId).select("fullName tokens").session(session);
          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          // Check if bet already exists for the same matchId + teamId + betType for this user
          const existingBet = await Bet.findOne({
               user: userId,
               matchId,
               teamId,
               betType,
          }).session(session);

          if (existingBet) {
               // Check if user has enough tokens for additional bet
               if (user.tokens < tokenAmount) {
                    return res.status(400).json({ message: "Insufficient tokens" });
               }

               // Deduct tokens
               await User.findByIdAndUpdate(
                    userId,
                    { $inc: { tokens: -Number(tokenAmount) } },
                    { new: true, session }
               );

               // Update existing bet
               existingBet.tokenAmount += Number(tokenAmount);
               existingBet.rate = Number(rate);
               await existingBet.save({ session });

               await session.commitTransaction();
               session.endSession();

               return res.status(200).json({
                    message: "Bet updated successfully",
                    bet: existingBet,
               });
          }

          // If no existing bet → create new one
          if (user.tokens < tokenAmount) {
               return res.status(400).json({ message: "Insufficient tokens" });
          }

          await User.findByIdAndUpdate(
               userId,
               { $inc: { tokens: -Number(tokenAmount) } },
               { new: true, session }
          );

          const newBet = new Bet({
               matchId,
               teamId,
               rate: Number(rate),
               tokenAmount: Number(tokenAmount),
               type,
               betType,
               user: userId,
               fullName: user.fullName,
               result: "pending",
          });

          await newBet.save({ session });

          await session.commitTransaction();
          session.endSession();

          return res.status(201).json({
               message: "Bet placed successfully",
               bet: newBet,
          });
     } catch (error: any) {
          await session.abortTransaction();
          session.endSession();

          console.error("Error creating/updating bet:", error);
          return res.status(500).json({ message: "Server Error" });
     }
};


// Get bets list
export const getBetsList = async (req: Request, res: Response) => {
     try {
          const loggedInUserId = (req as any).user.id;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 15;

          // Fetch logged-in user with role
          const loggedInUser = await User.findById(loggedInUserId)
               .select("role fullName createdBy") // only needed fields
               .lean();

          if (!loggedInUser) {
               return res.status(404).json({ message: "User not found" });
          }

          const role = await Role.findById(loggedInUser.role as any).lean();
          if (!role) {
               return res.status(400).json({ message: "Role not found" });
          }

          // Recursive fetch for descendants
          const getDescendantIds = async (userId: string): Promise<string[]> => {
               const children = await User.find({ createdBy: userId })
                    .select("_id")
                    .lean();
               let allIds = children.map((c) => c._id.toString());
               for (const child of children) {
                    const subIds = await getDescendantIds(child._id.toString());
                    allIds = [...allIds, ...subIds];
               }
               return allIds;
          };

          let query: any = {};
          if (!role.parentRole) {
               // super role → can see all bets
               query = {};
          } else {
               // self + descendants
               const descendantIds = await getDescendantIds(
                    loggedInUser._id.toString()
               );
               query = { user: { $in: [loggedInUser._id, ...descendantIds] } };
          }

          // Fetch bets with pagination
          const bets = await Bet.find(query)
               .populate("user", "fullName") // show who placed bet
               .skip((page - 1) * limit)
               .limit(limit)
               .sort({ createdAt: -1 })
               .lean();

          const total = await Bet.countDocuments(query);

          return res.json({
               success: true,
               page,
               limit,
               total,
               data: bets,
          });
     } catch (err) {
          console.error("❌ Error in getBetsList:", err);
          res.status(500).json({ message: "Server error" });
     }
};
