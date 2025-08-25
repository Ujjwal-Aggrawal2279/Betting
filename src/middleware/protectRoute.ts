import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
     user?: any;
}

export const protectRoute = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
     try {
          const authHeader = req.headers.authorization;
          
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
               return res.status(401).json({ message: "Unauthorized: No token provided" });
          }
          
          const token = authHeader.split(" ")[1];
          
          if (!process.env.JWT_SECRET_KEY) {
               throw new Error("JWT_SECRET is not set in environment variables");
          }
          
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
          req.user = decoded;
          
          next();
     } catch (err) {
          return res.status(401).json({ message: "Unauthorized: Invalid token" });
     }
};
