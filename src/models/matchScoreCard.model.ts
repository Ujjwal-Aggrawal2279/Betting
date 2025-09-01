import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMatchScoreCard extends Document {
       matchId: string;
       scoreData: Record<string, any>;
       createdAt?: Date;
       updatedAt?: Date;
}

const matchScoreCardSchema: Schema<IMatchScoreCard> = new Schema(
       {
              matchId: { type: String, required: true, unique: true },
              scoreData: { type: Schema.Types.Mixed, default: {} },
       },
       {
              timestamps: true,
       }
);

const MatchScoreCard: Model<IMatchScoreCard> = mongoose.model<IMatchScoreCard>(
       "MatchScoreCard",
       matchScoreCardSchema
);

export default MatchScoreCard;
