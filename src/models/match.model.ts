import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
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
       status: "Scheduled" | "Live";
       createdAt?: Date;
       updatedAt?: Date;
}

const MatchSchema: Schema = new Schema(
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
                     enum: ["Scheduled", "Live"],
                     default: "Scheduled",
              },
       },
       { timestamps: true }
);

export default mongoose.model<IMatch>("Match", MatchSchema);
