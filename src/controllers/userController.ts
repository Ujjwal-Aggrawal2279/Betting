import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { Version } from "../models/version.model";
import { Types } from "mongoose";

// Create
export const createUser = async (req: Request, res: Response) => {
     try {
          const {
               firstName,
               lastName,
               fullName,
               username,
               email,
               password,
               enabled = true,
               isLoggedIn = false,
               role,
               permissions = [],
               tokens
          } = req.body;

          // get createdBy from JWT
          const createdBy = (req as any).user.id;

          // check if username or email already exists
          const existingUser = await User.findOne({
               $or: [{ username }, { email }],
          });
          if (existingUser) {
               return res.status(400).json({ message: "Username or email already exists" });
          }

          // check role exists
          const roleDoc = await Role.findById(role);
          if (!roleDoc) {
               return res.status(400).json({ message: "Invalid role provided" });
          }

          // combine role permissions + additional permissions passed
          const finalPermissions = Array.from(
               new Set([...(roleDoc.permissions || []), ...permissions])
          );

          // hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          // create user
          const user = new User({
               firstName,
               lastName,
               fullName: fullName || `${firstName} ${lastName}`,
               username,
               email,
               password: hashedPassword,
               enabled,
               isLoggedIn,
               role,
               permissions: finalPermissions,
               profilePic:
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + " " + lastName)}&background=random&color=fff`,
               tokens,
               createdBy: createdBy
          });

          await user.save();

          // -------------------------
          // Creation of version record
          // -------------------------
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

          res.status(201).json({
               message: "User created successfully",
          });
     } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Server error" });
     }
};

// Get 
export const getUsers = async (req: Request, res: Response) => {
     try {
          const loggedInUserId = (req as any).user.id;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 15;

          // Fetch logged-in user with role
          const loggedInUser = await User.findById(loggedInUserId)
               .select("-password -permissions")
               .populate("role", "name")
               .lean();
          if (!loggedInUser) return res.status(404).json({ message: "User not found" });

          const role = await Role.findById(loggedInUser.role as any).lean();
          if (!role) return res.status(400).json({ message: "Role not found" });

          let query = {};
          let selectFields = "-password";

          if (!role.parentRole) {
               // Root role → fetch all users
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


