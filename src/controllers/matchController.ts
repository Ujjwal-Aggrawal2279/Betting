import { Request, Response } from "express";
import matchModel, { IMatch } from "../models/match.model";
import historicalMatchModel, { IHistoricalMatch } from "../models/historicalmatch.model";
import matchOddsModel, { IMatchOdds } from "../models/matchOdds.model";
import { IUser, User } from "../models/user.model";
import mongoose from "mongoose";
import MatchScoreCard from "../models/matchScoreCard.model";

// Convert UTC to IST string
const convertToIST = (utcDate?: Date | string | null) => {
       if (!utcDate) return null;
       const dateObj = new Date(utcDate);
       const istOffset = 5.5 * 60; // IST offset in minutes
       const istDate = new Date(dateObj.getTime() + istOffset * 60 * 1000);
       return istDate.toISOString();
};

// Get Matches
export const getMatches = async (req: Request, res: Response) => {
       try {
              const statusFilter = (req.query.status as string)?.trim();

              if (!statusFilter) {
                     return res.status(400).json({ success: false, message: "Status query param is required" });
              }

              let matches: (IMatch | IHistoricalMatch)[] = [];

              if (statusFilter === "Live" || statusFilter === "Scheduled") {
                     matches = await matchModel.find(
                            { status: statusFilter },
                            {
                                   matchId: 1,
                                   format: 1,
                                   teamA: 1,
                                   teamB: 1,
                                   teamALogo: 1,
                                   teamBLogo: 1,
                                   title: 1,
                                   venue: 1,
                                   startDate: 1,
                                   endDate: 1,
                                   _id: 0,
                            }
                     ).lean<IMatch[]>();
              } else if (statusFilter === "Completed" || statusFilter === "Cancelled") {
                     matches = await historicalMatchModel.find(
                            { status: statusFilter },
                            {
                                   matchId: 1,
                                   format: 1,
                                   teamA: 1,
                                   teamB: 1,
                                   teamALogo: 1,
                                   teamBLogo: 1,
                                   title: 1,
                                   venue: 1,
                                   startDate: 1,
                                   endDate: 1,
                                   _id: 0,
                            }
                     ).lean<IHistoricalMatch[]>();
              } else {
                     return res.status(400).json({ success: false, message: "Invalid status value" });
              }

              const converted = matches.map(match => ({
                     ...match,
                     startDate: convertToIST(match.startDate),
                     endDate: convertToIST(match.endDate),
              }));

              return res.json({ success: true, data: converted });
       } catch (err) {
              console.error(err);
              return res.status(500).json({ success: false, message: "Server Error" });
       }
};

// Get Match Odds

type PopulatedUser = {
       _id: mongoose.Types.ObjectId;
       fullName: string;
};

type PopulatedMatchOdds = Omit<IMatchOdds, "createdBy"> & {
       createdBy?: PopulatedUser | null;
};

export const getMatchOdds = async (req: Request, res: Response) => {
       try {
              const userId = (req as any).user?.id;
              const user = await User.findById(userId).populate("role") as IUser & { role?: any };
              if (!user) return res.status(404).json({ message: "User not found" });

              const hasParentRole = user.role?.parentRole;
              const oddsQuery = hasParentRole ? { source: "APP" } : {};

              // Populate 'createdBy' with 'fullName'
              const oddsData = await matchOddsModel
                     .find(oddsQuery)
                     .populate<{ createdBy: Pick<IUser, "fullName"> }>("createdBy", "fullName")
                     .lean<PopulatedMatchOdds[]>();

              const matchIds = [...new Set(oddsData.map(o => o.matchId))];

              // 🔥 Fetch matches from both live + historical
              const [liveMatches, historicalMatches] = await Promise.all([
                     matchModel.find({ matchId: { $in: matchIds } }).lean<IMatch[]>(),
                     historicalMatchModel.find({ matchId: { $in: matchIds } }).lean<IMatch[]>(),
              ]);

              // Merge both arrays into one
              const allMatches = [...liveMatches, ...historicalMatches];

              // Build map for quick lookup
              const matchMap: Record<string, IMatch> = allMatches.reduce((acc, match) => {
                     acc[match.matchId] = match;
                     return acc;
              }, {} as Record<string, IMatch>);

              const result = oddsData.map(odds => ({
                     id: odds._id.toString(),
                     matchId: odds.matchId,
                     matchName: matchMap[odds.matchId]?.title || "Unknown Match",
                     type: odds.type,
                     matchStatus: matchMap[odds.matchId]?.status || "Unknown Status",
                     source: odds.source,
                     odds: odds.odds,
                     createdBy: odds.createdBy?.fullName || null,
              }));

              return res.json(result);
       } catch (err) {
              console.error("Error fetching match odds:", err);
              return res.status(500).json({ message: "Server Error" });
       }
};


// Create Match Odds
export const createMatchOdds = async (req: Request, res: Response) => {
       try {
              const userId = (req as any).user?.id;
              const { matchId, type, source, odds } = req.body;

              if (!matchId || !type || !source || !odds?.teama || !odds?.teamb) {
                     return res.status(400).json({ message: "All required fields must be provided" });
              }

              const newOddsData = {
                     matchId,
                     type,
                     source: "APP",
                     odds: {
                            teama: { teamId: odds.teama.teamId , teamName: odds.teama.teamName, back: odds.teama.back, lay: odds.teama.lay },
                            teamb: { teamId: odds.teamb.teamId , teamName: odds.teamb.teamName, back: odds.teamb.back, lay: odds.teamb.lay },
                     },
                     createdBy: userId,
              };

              // Upsert: update if exists, otherwise create
              const updatedOrCreated = await matchOddsModel.findOneAndUpdate(
                     { matchId, type, createdBy: userId },
                     newOddsData,
                     { upsert: true, new: true, setDefaultsOnInsert: true }
              );

              return res.status(200).json({
                     message: "Match odds saved successfully",
                     data: updatedOrCreated,
              });
       } catch (err) {
              console.error("Error creating/updating match odds:", err);
              return res.status(500).json({ message: "Internal server error" });
       }
};


// Optimized function to find closest parent APP odds
const findParentOddsOptimized = async (
       userId: mongoose.Types.ObjectId,
       matchId: string
): Promise<PopulatedMatchOdds[] | null> => {
       const users: IUser[] = [];
       const visited = new Set<string>();
       let currentId: mongoose.Types.ObjectId | null = userId;

       // Build user hierarchy chain safely
       while (currentId) {
              const idStr = currentId.toString();
              if (visited.has(idStr)) break; // 🔒 stop infinite loop
              visited.add(idStr);

              const u = await User.findById(currentId)
                     .select("_id createdBy fullName")
                     .lean<IUser>();

              if (!u) break;
              users.push(u);

              currentId = u.createdBy as any;
       }

       const userIds = users.map(u => u._id);

       // Fetch all odds created by anyone in the hierarchy
       const odds = await matchOddsModel
              .find({ matchId, createdBy: { $in: userIds }, source: "APP" })
              .populate<{ createdBy: Pick<IUser, "fullName"> }>("createdBy", "fullName")
              .lean<PopulatedMatchOdds[]>();

       if (!odds.length) return null;

       // Return the odds created by the closest parent in the chain
       for (const u of users) {
              const o = odds.find(oo => oo.createdBy?._id?.toString() === u._id.toString());
              if (o) return [o];
       }

       return null;
};

// Controller
export const getMatchOddsByHierarchy = async (req: Request, res: Response) => {
       try {
              const userId = (req as any).user?.id;
              const { matchId } = req.params;

              if (!matchId) return res.status(400).json({ message: "matchId is required" });

              // Get hierarchical APP odds
              const appOdds = await findParentOddsOptimized(userId, matchId);

              // Get API odds for market reference
              const apiOdds = await matchOddsModel
                     .find({ matchId, source: "API" })
                     .lean<IMatchOdds[]>();

              const result = {
                     matchId,
                     appOdds: appOdds
                            ? appOdds.map(o => ({
                                   id: o._id.toString(),
                                   type: o.type,
                                   odds: o.odds,
                                   createdBy: o.createdBy?.fullName || null,
                            }))
                            : [],
                     apiOdds: apiOdds.map(o => ({
                            id: o._id.toString(),
                            type: o.type,
                            odds: o.odds,
                     })),
              };

              return res.json({ success: true, data: result });
       } catch (err) {
              console.error("Error fetching match odds:", err);
              return res.status(500).json({ message: "Server Error" });
       }
};


// Get scoreCard
export const matchScoreCard = async (req: Request, res: Response) => {
       try {
              const { matchId } = req.params;

              if (!matchId) {
                     return res.status(400).json({ message: "matchId is required" });
              }

              const scoreCard = await MatchScoreCard.findOne({ matchId }).lean();

              if (!scoreCard) {
                     return res.status(404).json({ message: "Scorecard not found for this match" });
              }

              return res.json({ success: true, data: scoreCard.scoreData });
       } catch (err) {
              console.error("Error fetching match scorecard:", err);
              return res.status(500).json({ message: "Server Error" });
       }
};