import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import matchModel from "../models/match.model";
import historicalmatchModel from "../models/historicalmatch.model";
import { Role } from "../models/role.model";
import { Token } from "../models/token.model";

// ------------------------------
// Helper: Get descendant user IDs safely
// ------------------------------
const getDescendantUserIds = (allUsers: any[], userId: string): string[] => {
       const visited = new Set<string>();
       const result: string[] = [];
       const queue = [userId];

       while (queue.length > 0) {
              const current = queue.shift()!;
              if (visited.has(current)) continue;
              visited.add(current);

              const children = allUsers.filter(u => u.createdBy?.toString() === current).map(u => u._id.toString());
              result.push(...children);
              queue.push(...children);
       }

       return result;
};

// ------------------------------
// Dashboard Stats
// ------------------------------
export const getDashboardStats = async (req: Request, res: Response) => {
       try {
              const loggedInUserId = (req as any).user.id;

              // 1️⃣ Users stats
              const [totalUsers, totalActiveUsers, totalInactiveUsers] = await Promise.all([
                     User.countDocuments(),
                     User.countDocuments({ enabled: true }),
                     User.countDocuments({ enabled: false }),
              ]);

              const startOfToday = new Date();
              startOfToday.setHours(0, 0, 0, 0);
              const newUsers = await User.countDocuments({ createdAt: { $gte: startOfToday } });

              // 2️⃣ Matches stats
              const [liveMatches, scheduledMatches, completedMatches, cancelledMatches] = await Promise.all([
                     matchModel.countDocuments({ status: "Live" }),
                     matchModel.countDocuments({ status: "Scheduled" }),
                     historicalmatchModel.countDocuments({ status: "Completed" }),
                     historicalmatchModel.countDocuments({ status: "Cancelled" }),
              ]);

              // 3️⃣ Token stats with hierarchy
              const loggedInUser = await User.findById(loggedInUserId).populate("role").lean();
              if (!loggedInUser) return res.status(404).json({ message: "User not found" });

              const role = await Role.findById(loggedInUser.role._id).lean();
              if (!role) return res.status(400).json({ message: "Role not found" });

              const allUsers = await User.find({}).select("_id createdBy").lean();
              let userIds: string[] = [loggedInUserId];

              if (!role.parentRole) {
                     const descendantIds = getDescendantUserIds(allUsers, loggedInUserId);
                     userIds = [...userIds, ...descendantIds];
              }

              const tokenStats = await Token.aggregate([
                     { $match: { requestedBy: { $in: userIds.map(id => new mongoose.Types.ObjectId(id)) } } },
                     {
                            $group: {
                                   _id: null,
                                   tokensRequested: { $sum: "$tokenAmount" },
                                   tokensApproved: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, "$tokenAmount", 0] } },
                                   tokensPendingApproval: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$tokenAmount", 0] } },
                                   tokensRejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, "$tokenAmount", 0] } },
                            },
                     },
              ]);

              const tokensData = tokenStats[0] || {
                     tokensRequested: 0,
                     tokensApproved: 0,
                     tokensPendingApproval: 0,
                     tokensRejected: 0,
              };

              return res.json({
                     success: true,
                     data: {
                            totalUsers,
                            totalActiveUsers,
                            totalInactiveUsers,
                            newUsers,
                            liveMatches,
                            scheduledMatches,
                            completedMatches,
                            cancelledMatches,
                            ...tokensData,
                     },
              });
       } catch (err) {
              console.error("❌ Error in getDashboardStats:", err);
              return res.status(500).json({ message: "Server error" });
       }
};

// ------------------------------
// Monthly Token Stats
// ------------------------------
export const getMonthlyTokenStats = async (req: Request, res: Response) => {
       try {
              const loggedInUserId = (req as any).user.id;

              const loggedInUser = await User.findById(loggedInUserId).populate("role").lean();
              if (!loggedInUser) return res.status(404).json({ message: "User not found" });

              const role = await Role.findById(loggedInUser.role._id).lean();
              if (!role) return res.status(400).json({ message: "Role not found" });

              const allUsers = await User.find({}).select("_id createdBy").lean();
              let userIds: string[] = [loggedInUserId];

              if (!role.parentRole) {
                     const descendantIds = getDescendantUserIds(allUsers, loggedInUserId);
                     userIds = [...userIds, ...descendantIds];
              }

              const now = new Date();
              const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
              const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

              const tokenStats = await Token.aggregate([
                     {
                            $match: {
                                   requestedBy: { $in: userIds.map(id => new mongoose.Types.ObjectId(id)) },
                                   createdAt: { $gte: firstDay, $lte: lastDay },
                            },
                     },
                     {
                            $group: {
                                   _id: { $dayOfMonth: "$createdAt" },
                                   requested: { $sum: "$tokenAmount" },
                                   approved: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, "$tokenAmount", 0] } },
                                   pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$tokenAmount", 0] } },
                                   rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, "$tokenAmount", 0] } },
                            },
                     },
                     { $sort: { "_id": 1 } },
              ]);

              const daysInMonth = lastDay.getDate();
              const data = Array.from({ length: daysInMonth }, (_, i) => {
                     const dayStat = tokenStats.find(t => t._id === i + 1);
                     return {
                            day: i + 1,
                            requested: dayStat?.requested || 0,
                            approved: dayStat?.approved || 0,
                            pending: dayStat?.pending || 0,
                            rejected: dayStat?.rejected || 0,
                     };
              });

              return res.json({ success: true, data });
       } catch (err) {
              console.error("❌ Error in getMonthlyTokenStats:", err);
              return res.status(500).json({ message: "Server error" });
       }
};
