// models/MatchResult.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMatchResult extends Document {
       matchId: number;
       winningTeamId: number;
       result: string;
       createdAt: Date;
       updatedAt: Date;
}

const MatchResultSchema: Schema = new Schema(
       {
              matchId: {
                     type: Number,
                     required: true,
              },
              winningTeamId: {
                     type: Number,
                     required: false,
              },
              result: {
                     type: String,
                     required: false,
              },
       },
       { timestamps: true }
);

export default mongoose.model<IMatchResult>("MatchResult", MatchResultSchema);
