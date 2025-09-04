import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { createBet, getBetsList } from "../controllers/betsController";

const router = express.Router();

router.get("/betslist", protectRoute, authenticateJWT, getBetsList);
router.post("/placebet", protectRoute, authenticateJWT, createBet)

export default router;