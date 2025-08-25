import { Request, Response } from "express";
import Chat from "../models/chat.model";

// Create Chat
export const createChat = async (req: Request, res: Response) => {
     try {
          const userId = (req as any).user?.id;
          const { message } = req.body;

          if (!message || message.trim() === "") {
               return res.status(400).json({ message: "Message is required" });
          }

          if (message.length > 100) {
               return res.status(400).json({ message: "Message too big" })
          }

          const chat = await Chat.create({
               sender: userId,
               message,
          });

          res.status(201).json({
               message: "Chat Posted",
          });
     } catch (err) {
          console.error("Error creating chat:", err);
          res.status(500).json({ message: "Server error" });
     }
};
