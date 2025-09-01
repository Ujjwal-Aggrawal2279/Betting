import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

interface JwtPayload {
       id: string;
       role: any;
}

export const authenticateSocket = (socket: Socket, next: (err?: any) => void) => {
       const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];

       if (!token) {
              return next(new Error("Unauthorized"));
       }

       try {
              const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
              (socket as any).user = decoded;
              next();
       } catch (err) {
              next(new Error("Invalid token"));
       }
};
