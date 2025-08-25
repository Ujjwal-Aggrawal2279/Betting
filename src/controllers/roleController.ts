// controllers/roleController.ts
import { Request, Response } from "express";
import { IRole, Role } from "../models/role.model";

// Create
export const createRole = async (req: Request, res: Response): Promise<void> => {
     try {
          const { name, parentRole, permissions }: { name: string; parentRole?: string; permissions?: string[] } = req.body;

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

          res.status(201).json({ message: "Role created successfully" });
     } catch (error) {
          console.error("Error creating role:", error);
          res.status(500).json({ error: "Internal server error" });
     }
};

// Get
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


