import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { getTokenList, requestToken, updateTokenStatus } from "../controllers/tokenController";

const router = express.Router();

router.get("/getTokens", protectRoute, authenticateJWT, getTokenList)
router.put("/updateTokenStatus/:tokenId", protectRoute, authenticateJWT, updateTokenStatus)
router.post("/requestToken", protectRoute, authenticateJWT, requestToken)

export default router;
