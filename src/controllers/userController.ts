import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { Version, IVersion } from "../models/version.model";
import { sendEmail } from "../config/mailer";
import mongoose from "mongoose";

// Create
export const createUser = async (req: Request, res: Response) => {
     try {
          const {
               firstName,
               lastName,
               username,
               email,
               password,
               enabled = true,
               role,
               permissions = [],
               tokens = 0,
          } = req.body;

          const createdBy = (req as any).user.id;

          const existingUser = await User.findOne({ $or: [{ username }, { email }] });
          if (existingUser)
               return res.status(400).json({ message: "Username or email already exists" });

          const roleDoc = await Role.findById(role);
          if (!roleDoc) return res.status(400).json({ message: "Invalid role provided" });

          const hashedPassword = await bcrypt.hash(password, 10);

          const user = new User({
               firstName,
               lastName,
               fullName: `${firstName} ${lastName}`,
               username,
               email,
               password: hashedPassword,
               enabled,
               role,
               permissions,
               profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    firstName + " " + lastName
               )}&background=random&color=fff`,
               tokens,
               createdBy,
          });

          await user.save();

          await Version.findOneAndUpdate(
               { tableName: "User", recordId: user._id },
               {
                    $push: {
                         history: {
                              userId: createdBy,
                              action: "create",
                              timestamp: new Date(),
                         },
                    },
               },
               { upsert: true }
          );

          // -------------------------
          // Send Welcome Email
          // -------------------------
          const html = `
          <div style="font-family: Arial, sans-serif; color: #333;">
               <h2>Welcome to BetHive, ${firstName}!</h2>
               <p>Your account has been successfully created.</p>
               <table style="margin-top: 20px; border-collapse: collapse;">
                    <tr>
                         <td style="padding: 8px; font-weight: bold;">Username:</td>
                         <td style="padding: 8px;">${username}</td>
                    </tr>
                    <tr>
                         <td style="padding: 8px; font-weight: bold;">Password:</td>
                         <td style="padding: 8px;">${password}</td>
                    </tr>
                    <tr>
                         <td style="padding: 8px; font-weight: bold;">Tokens:</td>
                         <td style="padding: 8px;">${tokens}</td>
                    </tr>
               </table>

               <p style="margin-top: 20px;">You can login to your account here:</p>
               <p>
                    <a href="https://bethive.vercel.app/login" style="color: #4F9DFF; text-decoration: none;">Login to BetHive</a>
               </p>

               <p>If you ever forget your password, reset it here:</p>
               <p>
                    <a href="https://bethive.vercel.app/forgot-password" style="color: #FACC15; text-decoration: none;">Reset Password</a>
               </p>

               <p style="margin-top: 20px;">Please keep this information safe.</p>
               <p>Happy betting! 🏏</p>
               <hr />
               <p style="font-size: 12px; color: #999;">
                    BetHive - Your trusted betting platform
               </p>
          </div>
          `;

          if (email) {
               sendEmail(email, "Your BetHive Account Details", html);
          }

          res.status(201).json({
               message: "User created successfully and email sent",
               user,
          });
     } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Server error" });
     }
};


// Get all users
export const getUsers = async (req: Request, res: Response) => {
     try {
          const loggedInUserId = (req as any).user.id;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 15;

          // Fetch logged-in user with role
          const loggedInUser = await User.findById(loggedInUserId)
               .select("-password -permissions -tokens -isLoggedIn -firstName -lastName -profilePic -username") // Exclude sensitive fields
               .populate("role", "name")
               .lean();

          if (!loggedInUser) return res.status(404).json({ message: "User not found" });

          const role = await Role.findById(loggedInUser.role as any).lean();
          if (!role) return res.status(400).json({ message: "Role not found" });

          let query = {};
          let selectFields = "-password -permissions -tokens -isLoggedIn -firstName -lastName -profilePic -username";

          if (!role.parentRole) {
               query = {};
          } else {
               // Recursive fetch for self + descendants
               const getDescendantIds = async (userId: string): Promise<string[]> => {
                    const children = await User.find({ createdBy: userId }).select("_id").lean();
                    let allIds = children.map((c) => c._id.toString());
                    for (const child of children) {
                         const subIds = await getDescendantIds(child._id.toString());
                         allIds = [...allIds, ...subIds];
                    }
                    return allIds;
               };

               const descendantIds = await getDescendantIds(loggedInUser._id.toString());
               query = { _id: { $in: [loggedInUser._id, ...descendantIds] } };
          }

          // Fetch users with pagination
          const users = await User.find(query)
               .select(selectFields)
               .populate("role", "name")
               .populate("createdBy", "fullName")
               .skip((page - 1) * limit)
               .limit(limit)
               .lean();

          const total = await User.countDocuments(query);

          return res.json({
               success: true,
               page,
               limit,
               total,
               data: users,
          });
     } catch (err) {
          console.error("❌ Error in getUsers:", err);
          res.status(500).json({ message: "Server error" });
     }
};

// Get single user
export const getSingleUser = async (req: Request, res: Response) => {
     try {
          const userId = req.params.id;

          // Find user by ID and populate the role
          const user = await User.findById(userId)
               .select("-password")
               .populate("role", "name")
               .lean();

          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          // Fetch version history for the user
          const versionDoc: IVersion | null = await Version.findOne({
               tableName: "User",
               recordId: user._id,
          })
               .populate("history.userId", "fullName firstName lastName")
               .lean();

          // Convert version history into a single string
          const versionHistory: string =
               versionDoc?.history
                    ?.map((h) => {
                         const user =
                              (h.userId as any)?.fullName ||
                              `${(h.userId as any)?.firstName || ""} ${(h.userId as any)?.lastName || ""}`.trim() ||
                              "Unknown User";

                         const actionText =
                              h.action === "create"
                                   ? "created this user"
                                   : h.action === "update"
                                        ? "updated this user"
                                        : "deleted this user";

                         const timestampText = h.timestamp
                              ? ` on ${new Date(h.timestamp).toLocaleDateString("en-GB")}`
                              : "";

                         return `${user} ${actionText}${timestampText}`;
                    })
                    .join("\n") || "No version history available";

          // Return formatted response
          res.status(200).json({
               user,
               versionHistory,
          });
     } catch (err) {
          console.error("❌ Error in getSingleUser:", err);
          res.status(500).json({ message: "Server error" });
     }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
     try {
          const updatedBy = (req as any).user.id;
          const userId = req.params.id;
          const { enabled, firstName, lastName, username, email, role, permissions } = req.body;

          // Fetch the user to be updated
          const user = await User.findById(userId);
          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          const updateFields: any = {};

          // If 'enabled' is being updated and changed
          if (enabled !== undefined && enabled !== user.enabled) {
               // Find users created by this user
               const relatedUsers = await User.find({ createdBy: userId });

               if (enabled === false) {
                    // Disable all related users
                    await User.updateMany(
                         { createdBy: userId, enabled: true },
                         { $set: { enabled: false } }
                    );
               } else if (enabled === true) {
                    // Enable all related users
                    await User.updateMany(
                         { createdBy: userId, enabled: false },
                         { $set: { enabled: true } }
                    );
               }

               updateFields.enabled = enabled;
          }

          // Update other fields if they differ from the current user data
          if (firstName && firstName !== user.firstName) updateFields.firstName = firstName;
          if (lastName && lastName !== user.lastName) updateFields.lastName = lastName;
          if (username && username !== user.username) updateFields.username = username;
          if (email && email !== user.email) updateFields.email = email;
          if (role && role !== user.role.toString()) updateFields.role = role;
          if (permissions && JSON.stringify(permissions) !== JSON.stringify(user.permissions)) {
               updateFields.permissions = permissions;
          }

          // If no changes are detected, return a message
          if (Object.keys(updateFields).length === 0) {
               return res.status(400).json({ message: "No changes detected" });
          }

          // Update the user
          await User.updateOne({ _id: userId }, updateFields);

          // Create version record (audit trail)
          await Version.findOneAndUpdate(
               { tableName: "User", recordId: user._id },
               {
                    $set: {
                         history: [
                              {
                                   userId: updatedBy,
                                   action: "update",
                                   timestamp: new Date(),
                                   changes: updateFields,
                              },
                         ],
                    },
               },
               { upsert: true }
          );

          return res.status(200).json({ message: "User updated successfully" });
     } catch (err) {
          console.error("Error updating user:", err);
          return res.status(500).json({ message: "Server error" });
     }
};


// Delete User and Related Users
export const deleteUser = async (req: Request, res: Response) => {
     try {
          const userId = req.params.id;

          // Step 1: Find the user to delete
          const user = await User.findById(userId);
          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          // Step 2: Find all users created by this user
          const childUsers = await User.find({ createdBy: userId });

          // Step 3: Delete all child users (users created by this user)
          if (childUsers.length > 0) {
               await User.deleteMany({ createdBy: userId });
          }

          // Step 4: Create version history record for deleted user
          const newVersion = new Version({
               tableName: "User",
               recordId: user._id,
               history: [
                    {
                         userId: userId,
                         action: "delete",
                         timestamp: new Date(),
                    },
               ],
          });

          // Step 5: Save the version history record
          await newVersion.save();

          // Step 6: Delete the user
          await User.deleteOne({ _id: userId });

          // Step 7: Return success message
          res.status(200).json({
               message: "User and related users deleted successfully, version history created.",
          });
     } catch (err) {
          console.error("❌ Error in deleteUser:", err);
          res.status(500).json({ message: "Server error" });
     }
};

// POST /users/:id/tokens
export const manageUserTokens = async (req: Request, res: Response) => {
     try {
          const userId = req.params.id;
          const { action, amount } = req.body;

          // Validate userId
          if (!mongoose.Types.ObjectId.isValid(userId)) {
               return res.status(400).json({ message: "Invalid user ID" });
          }

          // Validate action
          if (!["deposit", "withdraw"].includes(action)) {
               return res.status(400).json({ message: "Action must be 'deposit' or 'withdraw'" });
          }

          // Validate amount
          const tokenAmount = Number(amount);
          if (isNaN(tokenAmount) || tokenAmount <= 0) {
               return res.status(400).json({ message: "Amount must be a positive number" });
          }

          const user = await User.findById(userId);
          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          // Update tokens
          if (action === "deposit") {
               user.tokens += tokenAmount;
          } else if (action === "withdraw") {
               if (user.tokens < tokenAmount) {
                    return res.status(400).json({ message: "Insufficient tokens" });
               }
               user.tokens -= tokenAmount;
          }

          await user.save();

          return res.status(200).json({
               message: `Successfully ${action}ed ${tokenAmount} tokens`,
               tokens: user.tokens,
          });
     } catch (err) {
          console.error("Error managing user tokens:", err);
          return res.status(500).json({ message: "Internal server error" });
     }
};