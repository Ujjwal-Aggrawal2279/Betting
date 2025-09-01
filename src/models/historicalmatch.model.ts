import mongoose, { Schema, Document } from "mongoose";

export interface IHistoricalMatch extends Document {
       matchId: string;
       title: string;
       teamA: string;
       teamB: string;
       teamALogo?: string;
       teamBLogo?: string;
       venue?: string;
       format: string;
       startDate: Date;
       endDate?: Date;
       status: "Completed" | "Cancelled";
       createdAt?: Date;
       updatedAt?: Date;
}

const HistoricalMatchSchema: Schema = new Schema(
       {
              matchId: { type: String, required: true, unique: true },
              title: { type: String, required: true },
              teamA: { type: String, required: true },
              teamB: { type: String, required: true },
              teamALogo: { type: String },
              teamBLogo: { type: String },
              venue: { type: String },
              format: { type: String, required: true },
              startDate: { type: Date, required: true },
              endDate: { type: Date },
              status: {
                     type: String,
                     enum: ["Completed", "Cancelled"],
                     required: true,
              },
       },
       { timestamps: true }
);

export default mongoose.model<IHistoricalMatch>("HistoricalMatch", HistoricalMatchSchema);
