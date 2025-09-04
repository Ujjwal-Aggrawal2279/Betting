import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
     id: string;
     role: any;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
     const authHeader = req.headers.authorization;
     if (!authHeader?.startsWith("Bearer ")) {
          return res.status(401).json({ message: "Unauthorized" });
     }
     
     const token = authHeader.split(" ")[1];

     try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
          (req as any).user = decoded;
          next();
     } catch (err) {
          return res.status(401).json({ message: "Invalid token" });
     }
};
