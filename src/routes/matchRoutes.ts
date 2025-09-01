import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { createMatchOdds, getMatches, getMatchOdds, getMatchOddsByHierarchy, matchScoreCard } from "../controllers/matchController";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = express.Router();

router.get("/getMatches", protectRoute, getMatches)
router.get("/getMatchOdds", protectRoute, authenticateJWT, getMatchOdds)
router.get("/getMatchOdds/:matchId", protectRoute, authenticateJWT, getMatchOddsByHierarchy)
router.get("/getScoreCard/:matchId", protectRoute, authenticateJWT, matchScoreCard)
router.post("/createOdds", protectRoute, authenticateJWT, createMatchOdds)

export default router;