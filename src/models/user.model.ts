import mongoose, { Schema, model, Document, Types } from "mongoose";
import { IRole } from "./role.model";

export interface IUser extends Document {
     _id: Types.ObjectId;
     firstName: string;
     lastName: string;
     fullName: string;
     username: string;
     email?: string;
     password: string;
     enabled: boolean;
     isLoggedIn: boolean;
     currentToken?: string | null;
     role: Types.ObjectId | IRole;
     permissions: string[];
     profilePic?: string;
     tokens: number;
     createdBy: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
     {
          firstName: { type: String, required: true },
          lastName: { type: String, required: true },
          fullName: { type: String },
          username: { type: String, required: true, unique: true },
          email: { type: String, unique: true, sparse: true },
          password: { type: String, required: true },
          enabled: { type: Boolean, default: true },
          isLoggedIn: { type: Boolean, default: false },
          currentToken: { type: String, default: null },
          role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
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
                         "create_user",
                         "edit_user",
                         "delete_user",
                         "view_user",
                         "impersonate_user",
                    ],
               },
          ],
          profilePic: { type: String, default: "" },
          tokens: { type: Number, required: true },
          createdBy: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true,
          },
     },
     { timestamps: true }
);

// Auto-generate fullName before save
UserSchema.pre("save", function (next) {
     this.fullName = `${this.firstName} ${this.lastName}`;
     next();
});

// Indexing
UserSchema.index({ role: 1, createdBy: 1 });
UserSchema.index({ currentToken: 1 });

export const User = model<IUser>("User", UserSchema);
