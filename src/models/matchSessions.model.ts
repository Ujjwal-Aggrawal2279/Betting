import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISession {
       teamName: string;
       overRange: string;
       runs: number;
       back: number;
       lay: number;
       actualRuns?: number;
}

export interface ISessionMarket extends Document {
       _id: Types.ObjectId;
       matchId: string;
       sessions: ISession[];
       createdBy?: mongoose.Types.ObjectId;
       createdAt?: Date;
       updatedAt?: Date;
}

const SessionSchema: Schema = new Schema<ISession>(
       {
              overRange: { type: String },
              runs: { type: Number },
              back: { type: Number },
              lay: { type: Number },
              teamName: { type: String, required: true },
              actualRuns: { type: Number, default: null },
       },
       { _id: false }
);

const SessionMarketSchema: Schema = new Schema<ISessionMarket>(
       {
              matchId: { type: String, required: true, index: true, unique: true },
              sessions: { type: [SessionSchema], required: true },
              createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
       },
       { timestamps: true }
);

export default mongoose.model<ISessionMarket>("SessionMarket", SessionMarketSchema);
