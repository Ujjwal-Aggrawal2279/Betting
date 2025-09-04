import mongoose, { Schema, Document, Types, model } from "mongoose";

export type BetResult = "won" | "lost" | "pending";
export type BetType = "matchodds" | "tiedmatch";

export interface IBet extends Document {
     _id: Types.ObjectId;
     matchId: string;
     fullName: string;
     teamId: string;
     tokenAmount: number;
     rate: number;
     result: BetResult;
     betType: string;
     type: BetType;
     user: Types.ObjectId;
     createdAt: Date;
     updatedAt: Date;
}

const BetSchema = new Schema<IBet>(
     {
          matchId: { type: String, required: true },
          fullName: { type: String, required: true, trim: true },
          teamId: { type: String, required: true },
          tokenAmount: { type: Number, required: true, min: 1 },
          rate: { type: Number, required: true, min: 1 },
          result: {
               type: String,
               enum: ["won", "lost", "pending"],
               default: "pending"
          },
          betType: {
               type: String,
               enum: ["lay", "back"],
               required: true
          },
          type: {
               type: String,
               enum: ["matchodds", "tiedmatch"],
               required: true
          },
          user: { type: Schema.Types.ObjectId, ref: "User", required: true },
     },
     { timestamps: true }
);

// Index for faster lookups by user and type
BetSchema.index({ user: 1, matchId: 1 });

export const Bet = model<IBet>("Bet", BetSchema);
