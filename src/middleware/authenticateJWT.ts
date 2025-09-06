import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

interface JwtPayload {
     id: string;
     role: any;
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
     const authHeader = req.headers.authorization;
     if (!authHeader?.startsWith("Bearer ")) {
          return res.status(401).json({ message: "Unauthorized" });
     }

     const token = authHeader.split(" ")[1];

     try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
          const user = await User.findById(decoded.id);
          if (!user || !user.isLoggedIn || user.currentToken !== token) {
               return res.status(401).json({ message: "Session expired. Please log in again." });
          }
          (req as any).user = decoded;
          next();
     } catch (err) {
          return res.status(401).json({ message: "Invalid token" });
     }
};
