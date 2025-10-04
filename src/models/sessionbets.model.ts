import mongoose, { Schema, Document, Types, model } from "mongoose";

export type SessionBetResult = "won" | "lost" | "pending";

export interface ISessionBet extends Document {
       matchId: string;
       overRange: string;       
       rate: number;            
       tokenAmount: number;
       result: SessionBetResult;
       fullName: string;        
       teamName: string;        
       user: Types.ObjectId;    
       createdAt: Date;
       updatedAt: Date;
}

const SessionBetSchema = new Schema<ISessionBet>(
       {
              matchId: { type: String, required: true },
              overRange: { type: String, required: true },
              rate: { type: Number, required: true, min: 1 },
              tokenAmount: { type: Number, required: true, min: 1 },
              result: {
                     type: String,
                     enum: ["won", "lost", "pending"],
                     default: "pending"
              },
              fullName: { type: String, required: true, trim: true },
              teamName: { type: String, required: true, trim: true },
              user: { type: Schema.Types.ObjectId, ref: "User", required: true },
       },
       { timestamps: true }
);

// Index for faster lookups by match, user, and overRange
SessionBetSchema.index({ matchId: 1, overRange: 1, user: 1 });

export const SessionBet = model<ISessionBet>("SessionBet", SessionBetSchema);
