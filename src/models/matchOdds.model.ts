import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOdds {
       back: string;
       lay: string;
}

export interface IMatchOdds extends Document {
       _id: Types.ObjectId;
       matchId: string;
       type: string;
       source: "API" | "APP";
       odds: {
              teama: IOdds;
              teamb: IOdds;
       };
       createdBy?: mongoose.Types.ObjectId;
       createdAt?: Date;
       updatedAt?: Date;
}

const OddsSchema: Schema = new Schema(
       {
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
