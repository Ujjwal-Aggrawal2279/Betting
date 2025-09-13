import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Bet } from "../models/bets.model";
import { Role } from "../models/role.model";
import mongoose from "mongoose";
import historicalmatchModel, { IHistoricalMatch } from "../models/historicalmatch.model";
import matchModel, { IMatch } from "../models/match.model";
import matchOddsModel, { IMatchOdds } from "../models/matchOdds.model";

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
interface MatchTitleDoc {
     title: string;
}

export const getBetsList = async (req: Request, res: Response) => {
     try {
          const loggedInUserId = (req as any).user.id;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 15;

          // Fetch logged-in user with role
          const loggedInUser = await User.findById(loggedInUserId)
               .select("role fullName createdBy")
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
               .populate("user", "fullName")
               .skip((page - 1) * limit)
               .limit(limit)
               .sort({ createdAt: -1 })
               .lean();

          const total = await Bet.countDocuments(query);

          // 🔗 Attach match title for each bet
          const betsWithMatchTitle = await Promise.all(
               bets.map(async (bet) => {
                    try {
                         // 0. Get Team Name
                         // force the oddsDoc.odds to be treated as any or as the right shape
                         const oddsDoc = await matchOddsModel
                              .findById(bet.matchId)
                              .lean();

                         let teamName: string | undefined;

                         // ✅ type assertion fixes the TS error without touching model file
                         const odd = oddsDoc?.odds as any;

                         if (odd?.teama?.teamId === bet.teamId) {
                              teamName = odd.teama.teamName;
                         } else if (odd?.teamb?.teamId === bet.teamId) {
                              teamName = odd.teamb.teamName;
                         }

                         teamName = teamName || "Unknown Team";

                         // 1. Get matchOdds again (use findOne instead of findById)
                         const odds = await matchOddsModel
                              .findById(bet.matchId)
                              .lean();

                         if (!odds) {
                              return { ...bet, teamName, matchTitle: "Unknown Match" };
                         }

                         // 2. Try fetching from matchModel
                         let match: MatchTitleDoc | null = await matchModel
                              .findOne({ matchId: odds.matchId })
                              .select("title")
                              .lean<MatchTitleDoc>();

                         // 3. If not in live matches, try historical
                         if (!match) {
                              match = await historicalmatchModel
                                   .findOne({ matchId: odds.matchId })
                                   .select("title")
                                   .lean<MatchTitleDoc>();
                         }

                         return {
                              ...bet,
                              teamName,
                              matchTitle: match?.title || "Unknown Match",
                         };
                    } catch (err) {
                         console.error(`Error fetching match for bet ${bet._id}:`, err);
                         return { ...bet, matchTitle: "Unknown Match" };
                    }
               })
          );

          return res.json({
               success: true,
               page,
               limit,
               total,
               data: betsWithMatchTitle,
          });
     } catch (err) {
          console.error("❌ Error in getBetsList:", err);
          res.status(500).json({ message: "Server error" });
     }
};
