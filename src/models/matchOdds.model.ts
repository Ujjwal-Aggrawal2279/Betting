import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOdds {
       teamId: string;
       teamName: string;
       back: string;
       lay: string;
}

export interface IMatchOdds extends Document {
       _id: Types.ObjectId;
       matchId: string;
       type: string;
       source: "API" | "APP";
       odds: {
              teamId: IOdds;
              teamName: IOdds;
              back: IOdds;
              lay: IOdds;
       };
       createdBy?: mongoose.Types.ObjectId;
       createdAt?: Date;
       updatedAt?: Date;
}

const OddsSchema: Schema = new Schema(
       {
              teamId: { type: String, required: true },
              teamName: { type: String, required: true },
              back: { type: String, required: true },
              lay: { type: String, required: true },
       },
       { _id: false }
);

const MatchOddsSchema: Schema = new Schema(
       {
              matchId: { type: String, required: true, index: true },
              type: { type: String, required: true },
              source: { type: String, enum: ["API", "APP"], required: true },
              odds: {
                     teama: { type: OddsSchema, required: true },
                     teamb: { type: OddsSchema, required: true },
              },
              createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
       },
       { timestamps: true }
);

export default mongoose.model<IMatchOdds>("MatchOdds", MatchOddsSchema);
