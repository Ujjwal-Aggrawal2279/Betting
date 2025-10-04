import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { checkPermission } from "../middleware/checkPermission";
import { createMatchSession, createSessionBet, getAllMatchSessions, getMatchSessions, updateActualRuns } from "../controllers/sessionController";

const router = express.Router();

router.get("/getMatchSessions", protectRoute, checkPermission("match_session_manager"), getAllMatchSessions);
router.get("/getMatchSessions/:matchId", protectRoute, getMatchSessions);
router.post("/createSession", protectRoute, checkPermission("match_session_manager"), authenticateJWT, createMatchSession);
router.post("/createSessionBet", protectRoute, checkPermission("match_session_manager"), authenticateJWT, createSessionBet);
router.patch("/updateSession", protectRoute, checkPermission("match_session_manager"), updateActualRuns);

export default router;