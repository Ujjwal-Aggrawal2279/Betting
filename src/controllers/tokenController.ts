import { Request, Response } from "express";
import { Role } from "../models/role.model";
import { Token, IToken } from "../models/token.model";
import { User } from "../models/user.model";

// Fetch all tokens
export const getTokenList = async (req: Request, res: Response) => {
       try {
              const loggedInUserId = (req as any).user.id;
              const page = parseInt(req.query.page as string) || 1;
              const limit = parseInt(req.query.limit as string) || 15;

              // Fetch logged-in user with role
              const loggedInUser = await User.findById(loggedInUserId)
                     .select("-password -tokens -isLoggedIn")
                     .populate("role")
                     .lean();

              if (!loggedInUser) return res.status(404).json({ message: "User not found" });

              const role = await Role.findById(loggedInUser.role._id).lean();
              if (!role) return res.status(400).json({ message: "Role not found" });

              let query = {};

              if (!role.parentRole) {
                     // Super admin → fetch all tokens
                     query = {};
              } else {
                     // Recursive fetch for self + descendants
                     const getDescendantUserIds = async (userId: string): Promise<string[]> => {
                            const children = await User.find({ createdBy: userId }).select("_id").lean();
                            let allIds = children.map((c) => c._id.toString());
                            for (const child of children) {
                                   const subIds = await getDescendantUserIds(child._id.toString());
                                   allIds = [...allIds, ...subIds];
                            }
                            return allIds;
                     };

                     const descendantIds = await getDescendantUserIds(loggedInUser._id.toString());
                     query = { requestedBy: { $in: [loggedInUser._id, ...descendantIds] } };
              }

              const total = await Token.countDocuments(query);

              const tokens = await Token.find(query)
                     .populate("requestedBy", "fullName username email")
                     .populate("requestedTo", "fullName username email")
                     .populate("approvedBy", "fullName username email")
                     .populate("rejectedBy", "fullName username email")
                     .sort({ createdAt: -1 })
                     .skip((page - 1) * limit)
                     .limit(limit)
                     .lean();

              res.json({
                     success: true,
                     page,
                     limit,
                     total,
                     data: tokens,
              });
       } catch (err) {
              console.error("❌ Error in getTokenList:", err);
              res.status(500).json({ message: "Server error" });
       }
};


// request token
export const requestToken = async (req: Request, res: Response) => {
       try {
              const userId = (req as any).user.id;
              const { tokenAmount } = req.body;

              if (!tokenAmount || tokenAmount <= 0) {
                     return res.status(400).json({ message: "Token amount is required and must be greater than 0" });
              }

              // Fetch the logged-in user to get the createdBy field
              const user = await User.findById(userId).select("createdBy").lean();
              if (!user) return res.status(404).json({ message: "User not found" });

              if (!user.createdBy) return res.status(400).json({ message: "User does not have a creator assigned" });

              // Create new token request
              const newToken = await Token.create({
                     requestedBy: userId,
                     requestedTo: user.createdBy,
                     tokenAmount,
                     status: "pending",
              });

              res.status(201).json({
                     success: true,
                     message: "Token request submitted successfully",
                     data: newToken,
              });
       } catch (err) {
              console.error("❌ Error in requestToken:", err);
              res.status(500).json({ message: "Server error" });
       }
};


// Update token status
export const updateTokenStatus = async (req: Request, res: Response) => {
       try {
              const loggedInUserId = (req as any).user.id;
              const { tokenId } = req.params;
              const { status } = req.body;

              if (!["approved", "rejected", "cancelled"].includes(status)) {
                     return res.status(400).json({ message: "Invalid status" });
              }

              const token = await Token.findById(tokenId);
              if (!token) {
                     return res.status(404).json({ message: "Token not found" });
              }

              const requestedUser = await User.findById(token.requestedBy);
              if (!requestedUser) {
                     return res.status(404).json({ message: "Requested user not found" });
              }

              const approverUser = await User.findById(loggedInUserId);
              if (!approverUser) {
                     return res.status(404).json({ message: "Approver user not found" });
              }

              const previousStatus = token.status;

              // Prevent invalid transitions
              if (previousStatus === "rejected" && status !== "cancelled") {
                     return res.status(400).json({ message: "Cannot change status of rejected token" });
              }

              token.status = status as any;

              if (status === "approved") {
                     token.approvedBy = loggedInUserId;
                     token.rejectedBy = undefined;

                     // Transfer tokens only if not already approved
                     if (previousStatus !== "approved") {
                            if (approverUser.tokens < token.tokenAmount) {
                                   return res.status(400).json({ message: "Approver does not have enough tokens" });
                            }

                            // Deduct from approver
                            approverUser.tokens -= token.tokenAmount;

                            // Give to requested user
                            requestedUser.tokens += token.tokenAmount;

                            await approverUser.save();
                            await requestedUser.save();
                     }
              }

              if (status === "rejected") {
                     token.rejectedBy = loggedInUserId;
                     token.approvedBy = undefined;

                     if (previousStatus === "approved") {
                            approverUser.tokens += token.tokenAmount; 
                            requestedUser.tokens -= token.tokenAmount; 
                            if (requestedUser.tokens < 0) requestedUser.tokens = 0;

                            await approverUser.save();
                            await requestedUser.save();
                     }
              }

              await token.save();

              res.json({ success: true, data: token });
       } catch (err) {
              console.error("❌ Error updating token status:", err);
              res.status(500).json({ message: "Server error" });
       }
};

