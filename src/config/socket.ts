import { Server } from "socket.io";
import http from "http";
import { registerUserHandlers } from "../sockets/userSocket";
import { registerChatHandlers } from "../sockets/chatSocket";
import { registerMatchFetchHandlers } from "../sockets/matchFetchSocket";
import { authenticateSocket } from "../middleware/authenticateSocket";
import { scheduleMatchCron } from "../cron/matchCron";

export const initSocket = (server: http.Server) => {
       const io = new Server(server, {
              cors: { origin: "*", methods: ["GET", "POST"] },
       });

       // Socket authentication middleware
       io.use(authenticateSocket);

       io.on("connection", (socket) => {
              console.log("🔌 User connected:", socket.id);

              // Register handlers
              registerUserHandlers(io, socket);
              registerChatHandlers(io, socket);
              registerMatchFetchHandlers(io, socket);

              socket.on("disconnect", () => {
                     console.log("❌ User disconnected:", socket.id);
              });
       });

       // Starting cron jobs for periodic match fetching & auto-emitting
       scheduleMatchCron(io);

       return io;
};
