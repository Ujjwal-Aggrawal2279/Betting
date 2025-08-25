import { Router } from "express";
import { createUser, getUsers } from "../controllers/userController";
import { protectRoute } from "../middleware/protectRoute";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

router.get("/getUsers", protectRoute, authenticateJWT, getUsers)
router.post("/createUser", protectRoute, authenticateJWT, createUser);

export default router;
