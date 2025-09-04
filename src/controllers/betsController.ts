import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Bet } from "../models/bets.model";
import { Role } from "../models/role.model";

// POST /api/bets
export const createBet = async (req: Request, res: Response) => {
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
          const user = await User.findById(userId).select("fullName tokens");
          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          // Check if bet already exists for the same matchId + teamId + betType for this user
          const existingBet = await Bet.findOne({
               user: userId,
               matchId,
               teamId,
               betType,
          });

          if (existingBet) {
               return res.status(400).json({ message: "You have already placed this bet" });
          }

          // Check if user has enough tokens
          if (user.tokens < tokenAmount) {
               return res.status(400).json({ message: "Insufficient tokens" });
          }

          // Deduct tokens
          user.tokens -= Number(tokenAmount);
          await user.save();

          // Create new bet
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

          await newBet.save();

          return res.status(201).json({
               message: "Bet placed successfully",
               bet: newBet,
          });

     } catch (error) {
          console.error("Error creating bet:", error);
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
