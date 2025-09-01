import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { getDashboardStats, getMonthlyTokenStats } from "../controllers/dashboardController";

const router = express.Router();

router.get("/dashboard/stats", protectRoute, authenticateJWT, getDashboardStats)
router.get("/dashboard/chart", protectRoute, authenticateJWT, getMonthlyTokenStats)

export default router;