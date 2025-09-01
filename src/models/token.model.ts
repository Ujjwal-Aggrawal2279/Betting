import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
       requestedBy: Types.ObjectId;
       requestedTo: Types.ObjectId;
       tokenAmount: number;
       status: "pending" | "approved" | "rejected" | "cancelled";
       approvedBy?: Types.ObjectId;
       rejectedBy?: Types.ObjectId;
       createdAt: Date;
       updatedAt: Date;
}

const tokenSchema = new Schema<IToken>(
       {
              requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
              requestedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
              tokenAmount: { type: Number, required: true },
              status: {
                     type: String,
                     enum: ["pending", "approved", "rejected", "cancelled"],
                     default: "pending",
              },
              approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
              rejectedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
       },
       {
              timestamps: true,
       }
);

export const Token = mongoose.model<IToken>("Token", tokenSchema);
