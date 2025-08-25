import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { createChat } from "../controllers/chatController";

const router = express.Router();

router.post("/createChat", protectRoute, authenticateJWT, createChat);

export default router;
