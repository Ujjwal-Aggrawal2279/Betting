import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import matchModel from "../models/match.model";
import historicalmatchModel from "../models/historicalmatch.model";
import { Role } from "../models/role.model";
import { Token } from "../models/token.model";

export const getDashboardStats = async (req: Request, res: Response) => {
       try {
              const loggedInUserId = (req as any).user.id;

              // ----------------------------
              // Users stats
              // ----------------------------
              const totalUsers = await User.countDocuments();
              const totalActiveUsers = await User.countDocuments({ enabled: true });
              const totalInactiveUsers = await User.countDocuments({ enabled: false });

              const startOfToday = new Date();
              startOfToday.setHours(0, 0, 0, 0);

              const newUsers = await User.countDocuments({ createdAt: { $gte: startOfToday } });

              // ----------------------------
              // Matches stats
              // ----------------------------
              const liveMatches = await matchModel.countDocuments({ status: "Live" });
              const scheduledMatches = await matchModel.countDocuments({ status: "Scheduled" });
              const completedMatches = await historicalmatchModel.countDocuments({ status: "Completed" });
              const cancelledMatches = await historicalmatchModel.countDocuments({ status: "Cancelled" });

              // ----------------------------
              // Token stats with hierarchy
              // ----------------------------
              const loggedInUser = await User.findById(loggedInUserId).populate("role").lean();
              if (!loggedInUser) return res.status(404).json({ message: "User not found" });

              const role = await Role.findById(loggedInUser.role._id).lean();
              if (!role) return res.status(400).json({ message: "Role not found" });

              // Recursive function to get descendant user IDs
              const getDescendantUserIds = async (userId: string): Promise<string[]> => {
                     const children = await User.find({ createdBy: userId }).select("_id").lean();
                     let allIds = children.map((c) => c._id.toString());
                     for (const child of children) {
                            const subIds = await getDescendantUserIds(child._id.toString());
                            allIds = [...allIds, ...subIds];
                     }
                     return allIds;
              };

              let userIds: string[] = [loggedInUserId];

              if (!role.parentRole) {
                     // Master / top-level → include all descendants
                     const descendantIds = await getDescendantUserIds(loggedInUserId);
                     userIds = [...userIds, ...descendantIds];
              }
              // Last-level users → just themselves (userIds = [loggedInUserId])

              // Aggregate token stats
              const tokenStats = await Token.aggregate([
                     {
                            $match: {
                                   requestedBy: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) },
                            },
                     },
                     {
                            $group: {
                                   _id: null,
                                   tokensRequested: { $sum: "$tokenAmount" },
                                   tokensApproved: {
                                          $sum: { $cond: [{ $eq: ["$status", "approved"] }, "$tokenAmount", 0] },
                                   },
                                   tokensPendingApproval: {
                                          $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$tokenAmount", 0] },
                                   },
                                   tokensRejected: {
                                          $sum: { $cond: [{ $eq: ["$status", "rejected"] }, "$tokenAmount", 0] },
                                   },
                            },
                     },
              ]);

              const tokensData = tokenStats[0] || {
                     tokensRequested: 0,
                     tokensApproved: 0,
                     tokensPendingApproval: 0,
                     tokensRejected: 0,
              };

              // ----------------------------
              // Response
              // ----------------------------
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


export const getMonthlyTokenStats = async (req: Request, res: Response) => {
       try {
              const loggedInUserId = (req as any).user.id;

              // Fetch logged-in user with role
              const loggedInUser = await User.findById(loggedInUserId).populate("role").lean();
              if (!loggedInUser) return res.status(404).json({ message: "User not found" });

              const role = await Role.findById(loggedInUser.role._id).lean();
              if (!role) return res.status(400).json({ message: "Role not found" });

              // Recursive function to get all descendant user IDs
              const getDescendantUserIds = async (userId: string): Promise<string[]> => {
                     const children = await User.find({ createdBy: userId }).select("_id").lean();
                     let allIds = children.map(c => c._id.toString());
                     for (const child of children) {
                            const subIds = await getDescendantUserIds(child._id.toString());
                            allIds = [...allIds, ...subIds];
                     }
                     return allIds;
              };

              let userIds: string[] = [loggedInUserId];
              if (!role.parentRole) {
                     const descendantIds = await getDescendantUserIds(loggedInUserId);
                     userIds = [...userIds, ...descendantIds];
              }

              // Get first and last day of current month
              const now = new Date();
              const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
              const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

              // Aggregate tokens per day
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

              // Map to array for all days of month
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