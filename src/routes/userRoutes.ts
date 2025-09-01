import { Router } from "express";
import { createUser, deleteUser, getSingleUser, getUsers, updateUser } from "../controllers/userController";
import { protectRoute } from "../middleware/protectRoute";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

router.get("/getUsers", protectRoute, authenticateJWT, getUsers)
router.get("/getSingleUser/:id", protectRoute, authenticateJWT, checkPermission("view_user"), getSingleUser)
router.post("/createUser", protectRoute, checkPermission(["create_user"]), authenticateJWT, createUser);
router.patch("/patchUser/:id", protectRoute, checkPermission(["edit_user"]), authenticateJWT, updateUser);
router.delete("/deleteUser/:id", protectRoute, checkPermission(["delete_user"]), authenticateJWT, deleteUser);

export default router;
