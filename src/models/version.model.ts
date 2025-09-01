import mongoose, { Schema, Document, Types } from "mongoose";

interface ChangeEntry {
     userId: Types.ObjectId;
     action: "create" | "update" | "delete";
     changes: Record<string, { oldValue: any; newValue: any }>;
     timestamp: Date;
}

export interface IVersion extends Document {
     tableName: string;
     recordId: string;
     history: ChangeEntry[];
}

const VersionSchema = new Schema<IVersion>({
     tableName: { type: String, required: true },
     recordId: Types.ObjectId,
     history: [
          {
               userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
               action: { type: String, enum: ["create", "update", "delete"], required: true },
               changes: { type: Schema.Types.Mixed },
               timestamp: { type: Date, default: Date.now },
          },
     ],
});

export const Version = mongoose.model<IVersion>("Version", VersionSchema);
