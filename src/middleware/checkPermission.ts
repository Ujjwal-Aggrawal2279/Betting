import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

// Middleware Permission
export const checkPermission =
       (requiredPermissions: string | string[]) =>
              async (req: Request, res: Response, next: NextFunction) => {
                     try {
                            const userId = (req as any).user?.id;
                            if (!userId) return res.status(401).json({ message: "Unauthorized" });

                            // Fetch user with role and permissions
                            const user = await User.findById(userId).populate("role", "permissions").lean();
                            if (!user) return res.status(401).json({ message: "Unauthorized" });

                            const permissions = Array.isArray(requiredPermissions)
                                   ? requiredPermissions
                                   : [requiredPermissions];

                            const userPermissions: string[] = user.permissions || [];
                            const hasAll = permissions.every((perm) => userPermissions.includes(perm));

                            if (!hasAll) return res.status(403).json({ message: "Forbidden: insufficient permissions" });

                            next();
                     } catch (err) {
                            console.error("Permission check failed:", err);
                            return res.status(500).json({ message: "Server error" });
                     }
              };
