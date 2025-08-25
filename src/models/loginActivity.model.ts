import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILoginActivity extends Document {
     userId: Types.ObjectId;
     ipAddress: string;
     timestamp: Date;
     status: "login" | "logout";
     lat?: number;
     lng?: number;
}

const LoginActivitySchema = new Schema<ILoginActivity>({
     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
     ipAddress: { type: String, required: true },
     timestamp: { type: Date, default: Date.now },
     status: { type: String, enum: ["login", "logout"], required: true },
     lat: { type: Number },
     lng: { type: Number },
});

// Indexing
LoginActivitySchema.index({ userId: 1, createdAt: -1 });

export const LoginActivity = mongoose.model<ILoginActivity>(
     "LoginActivity",
     LoginActivitySchema
);
