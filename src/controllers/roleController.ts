// controllers/roleController.ts
import { Request, Response } from "express";
import { IRole, Role } from "../models/role.model";
import { Version, IVersion } from "../models/version.model";
import mongoose from "mongoose";
import { User, IUser } from "../models/user.model";

// Create
export const createRole = async (req: Request, res: Response): Promise<void> => {
     try {
          const { name, parentRole, permissions }: { name: string; parentRole?: string; permissions?: string[] } = req.body;

          // get createdBy from JWT
          const createdBy = (req as any).user.id;

          // Ensure role name is unique
          const existingRole = await Role.findOne({ name });
          if (existingRole) {
               res.status(400).json({ error: "This role already exists" });
               return;
          }

          // Validate parentRole (if provided)
          let parentRoleDoc = null;
          if (parentRole) {
               parentRoleDoc = await Role.findOne({ name: parentRole });
               if (!parentRoleDoc) {
                    res.status(400).json({ error: "Parent role not found" });
                    return;
               }
          }

          // Create role with only given permissions (no inheritance applied here)
          const newRole: IRole = new Role({
               name,
               parentRole: parentRoleDoc ? parentRoleDoc._id : undefined,
               permissions: permissions || [],
          });

          await newRole.save();

          // -------------------------
          // Creation of version record
          // -------------------------
          await Version.findOneAndUpdate(
               { tableName: "Role", recordId: newRole._id },
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

          res.status(201).json({ message: "Role created successfully" });
     } catch (error) {
          console.error("Error creating role:", error);
          res.status(500).json({ error: "Internal server error" });
     }
};

// Get Roles
export const getRoles = async (req: Request, res: Response): Promise<void> => {
     try {
          // Fetch all roles
          const roles = await Role.find().lean();

          // Lookup map for tree building
          const roleMap: Record<string, any> = {};
          const roleOptions: { value: string; label: string }[] = [];

          roles.forEach((role) => {
               roleMap[role._id.toString()] = {
                    id: role._id.toString(),
                    name: role.name,
                    children: [],
               };
               roleOptions.push({
                    value: role._id.toString(),
                    label: role.name,
               });
          });

          const tree: any[] = [];

          // Build hierarchy
          roles.forEach((role) => {
               if (role.parentRole) {
                    const parentId = role.parentRole.toString();
                    if (roleMap[parentId]) {
                         roleMap[parentId].children.push(roleMap[role._id.toString()]);
                    }
               } else {
                    // Root role
                    tree.push(roleMap[role._id.toString()]);
               }
          });

          // Return both tree and flat options
          res.status(200).json({
               tree,
               options: roleOptions,
          });
     } catch (error) {
          console.error("Error fetching roles:", error);
          res.status(500).json({ message: "Failed to fetch roles" });
     }
};

// Get specific roles permission
export const getSingleRolePermissions = async (req: Request, res: Response) => {
     try {
          const { roleId } = req.params;

          if (!roleId) {
               return res.status(400).json({ message: "Role Id is required" });
          }

          // Find the role by name
          const role = await Role.findById(roleId).lean();

          if (!role) {
               return res.status(404).json({ message: "Role not found" });
          }

          return res.json({
               permissions: role.permissions || [],
          });
     } catch (err) {
          console.error("Error fetching role permissions:", err);
          return res.status(500).json({ message: "Server error" });
     }
};

// Get role detail
export const getRoleDetail = async (req: Request, res: Response): Promise<void> => {
     try {
          const { roleId } = req.params;

          if (!roleId || !mongoose.Types.ObjectId.isValid(roleId)) {
               res.status(400).json({ message: "Valid role ID is required" });
               return;
          }

          // Find role by ID
          const role: IRole | null = await Role.findById(roleId).lean();
          if (!role) {
               res.status(404).json({ message: "Role not found" });
               return;
          }

          // Get users assigned to this role
          const users: IUser[] = await User.find({ role: role._id }).lean();
          const usersCount = users.length;
          const userNames = users.map(
               (u) => u.fullName || `${u.firstName} ${u.lastName}`
          );

          // Get version history with user populated
          const versionDoc: IVersion | null = await Version.findOne({
               tableName: "Role",
               recordId: role._id,
          })
               .populate("history.userId", "fullName firstName lastName")
               .lean();

          // Convert history into a single string
          const versionHistory: string =
               versionDoc?.history
                    ?.map((h) => {
                         const user =
                              (h.userId as any)?.fullName ||
                              `${(h.userId as any)?.firstName || ""} ${(h.userId as any)?.lastName || ""}`.trim() ||
                              "Unknown User";

                         const actionText =
                              h.action === "create"
                                   ? "created this role"
                                   : h.action === "update"
                                        ? "updated this role"
                                        : "deleted this role";

                         const timestampText = h.timestamp
                              ? ` on ${new Date(h.timestamp).toLocaleDateString("en-GB")}`
                              : "";

                         return `${user} ${actionText}${timestampText}`;
                    })
                    .join("\n") || "No version history available";

          // Return formatted response
          res.status(200).json({
               name: role.name,
               usersCount,
               users: userNames,
               permissions: role.permissions || [],
               versionHistory,
          });
     } catch (error) {
          console.error("Error fetching role detail:", error);
          res.status(500).json({ message: "Internal server error" });
     }
};

// edit role
export const editRole = async (req: Request, res: Response): Promise<void> => {
     try {
          const createdBy = (req as any).user.id;
          const { roleId } = req.params;
          const { permissions } = req.body;

          if (!roleId || !mongoose.Types.ObjectId.isValid(roleId)) {
               res.status(400).json({ message: "Valid role ID is required" });
               return;
          }

          if (!Array.isArray(permissions)) {
               res.status(400).json({ message: "Permissions must be an array" });
               return;
          }

          // Step 0: Fetch role first (to capture old permissions)
          const existingRole = await Role.findById(roleId);
          if (!existingRole) {
               res.status(404).json({ message: "Role not found" });
               return;
          }
          const oldPermissions = existingRole.permissions;

          // Step 1: Update the role
          const updatedRole = await Role.findByIdAndUpdate(
               roleId,
               { permissions },
               { new: true }
          );

          // Step 2: Update all users who have this role
          const updatedUsers = await User.updateMany(
               { role: roleId },
               { $set: { permissions } }
          );

          // Step 3: Create a version history record
          await Version.findOneAndUpdate(
               { tableName: "Role", recordId: updatedRole!._id },
               {
                    $set: {
                         history: [
                              {
                                   userId: createdBy,
                                   action: "update",
                                   changes: {
                                        permissions: {
                                             oldValue: oldPermissions,
                                             newValue: permissions,
                                        },
                                   },
                                   timestamp: new Date(),
                              },
                         ],
                    },
               },
               { upsert: true, new: true }
          );

          res.status(200).json({
               message: `Role and permissions updated successfully. ${updatedUsers.modifiedCount} users affected.`,
               role: updatedRole,
          });
     } catch (error) {
          console.error("Error updating role:", error);
          res.status(500).json({ message: "Internal server error" });
     }
};

// delete role
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
     try {
          const deletedBy = (req as any).user.id;
          const { roleId } = req.params;

          if (!roleId || !mongoose.Types.ObjectId.isValid(roleId)) {
               res.status(400).json({ message: "Valid role ID is required" });
               return;
          }

          // Step 0: Fetch the role first (to capture details for history)
          const existingRole = await Role.findById(roleId);
          if (!existingRole) {
               res.status(404).json({ message: "Role not found" });
               return;
          }

          const oldPermissions = existingRole.permissions;
          const oldRoleName = existingRole.name;

          // Step 1: Delete all users who have this role
          const deletedUsers = await User.deleteMany({ role: roleId });

          // Step 2: Delete the role itself
          await Role.findByIdAndDelete(roleId);

          // Step 3: Record version history
          await Version.findOneAndUpdate(
               { tableName: "Role", recordId: roleId },
               {
                    $set: {
                         history: [
                              {
                                   userId: deletedBy,
                                   action: "delete",
                                   changes: {
                                        role: {
                                             oldValue: { name: oldRoleName, permissions: oldPermissions },
                                             newValue: null,
                                        },
                                   },
                                   timestamp: new Date(),
                              },
                         ],
                    },
               },
               { upsert: true, new: true }
          );

          res.status(200).json({
               message: `Role deleted successfully. ${deletedUsers.deletedCount} users removed.`,
               roleId,
          });
     } catch (error) {
          console.error("Error deleting role:", error);
          res.status(500).json({ message: "Internal server error" });
     }
};