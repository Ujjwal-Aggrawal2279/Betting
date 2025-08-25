import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
     sender: mongoose.Types.ObjectId;
     message: string;
     createdAt: Date;
}

const ChatSchema: Schema<IChat> = new Schema(
     {
          sender: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true,
          },
          message: {
               type: String,
               required: true,
               trim: true,
               maxLength: 100
          },
          createdAt: {
               type: Date,
               default: Date.now,
               expires: 180,
          },
     },
     {
          timestamps: { createdAt: true, updatedAt: false },
     }
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
