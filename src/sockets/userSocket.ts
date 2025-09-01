import { Server, Socket } from "socket.io";
let onlineUsers = 0;

export const registerUserHandlers = (io: Server, socket: Socket) => {
       onlineUsers++;
       io.emit("onlineUsers", onlineUsers);

       socket.on("disconnect", () => {
              onlineUsers--;
              io.emit("onlineUsers", onlineUsers);
       });
};
