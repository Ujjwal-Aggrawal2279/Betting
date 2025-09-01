import { Server, Socket } from "socket.io";
import Chat from "../models/chat.model";

interface MessagePayload {
       message: string;
}

export const registerChatHandlers = (io: Server, socket: Socket) => {
       // Fetch old chats with profilePic
       socket.on("getMessages", async () => {
              try {
                     const messages = await Chat.find()
                            .sort({ createdAt: -1 })
                            .limit(50)
                            .populate("sender", "profilePic")
                            .lean();

                     // Reformat to send { avatar, text }
                     const formatted = messages.reverse().map((msg: any) => ({
                            avatar: msg.sender?.profilePic || null,
                            text: msg.message,
                     }));

                     socket.emit("messages", formatted);
              } catch (err) {
                     console.error("getMessages error:", err);
                     socket.emit("error", { message: "Failed to fetch messages" });
              }
       });

       // Send new message
       socket.on("sendMessage", async (data: MessagePayload) => {
              try {
                     if (!(socket as any).user) {
                            socket.emit("error", { message: "Unauthorized" });
                            return;
                     }

                     const chat = await Chat.create({
                            sender: (socket as any).user.id,
                            message: data.message,
                     });

                     // Populate sender to include profilePic 
                     const populatedChat = await chat.populate("sender", "profilePic");

                     io.emit("newMessage", {
                            avatar: (populatedChat.sender as any)?.profilePic || null,
                            text: populatedChat.message,
                     });
              } catch (err) {
                     console.error("sendMessage error:", err);
                     socket.emit("error", { message: "Failed to send message" });
              }
       });
};
