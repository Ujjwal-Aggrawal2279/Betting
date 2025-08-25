import { Router } from "express";
import { getRolePermissions, loginUser, logoutUser } from "../controllers/authController";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { protectRoute } from "../middleware/protectRoute";

const router = Router();

// POST /api/login
router.post("/login", loginUser);
// POST /api/logout
router.post("/logout", authenticateJWT, logoutUser);
// Get Permissions
router.get("/permissions", protectRoute, authenticateJWT, getRolePermissions);


export default router;
