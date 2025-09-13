import { Schema, model, Document, Types } from "mongoose";

// Role interface
export interface IRole extends Document {
     name: string;
     parentRole?: Types.ObjectId | null;
     permissions: RolePermission[];
}

// Define all possible permissions
export type RolePermission =
     | "view_roles"
     | "create_role"
     | "edit_role"
     | "delete_role"
     | "role_permissions_manager"
     | "token_manager"
     | "rates_manager"
     | "create_user"
     | "edit_user"
     | "delete_user"
     | "view_user"
     | "impersonate_user";

// Role schema
const RoleSchema = new Schema<IRole>(
     {
          name: { type: String, required: true, unique: true, trim: true },
          parentRole: { type: Schema.Types.ObjectId, ref: "Role", default: null },
          permissions: [
               {
                    type: String,
                    enum: [
                         "view_roles",
                         "create_role",
                         "edit_role",
                         "delete_role",
                         "role_permissions_manager",
                         "token_manager",
                         "rates_manager",
                         "create_user",
                         "edit_user",
                         "delete_user",
                         "view_user",
                         "impersonate_user",
                    ],
               },
          ],
     },
     { timestamps: true }
);

// Role model
export const Role = model<IRole>("Role", RoleSchema);
