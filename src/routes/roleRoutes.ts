import express from "express";
import { createRole, getRoles } from "../controllers/roleController";
import { protectRoute } from "../middleware/protectRoute";
import { checkPermission } from "../middleware/checkPermission";

const router = express.Router();

router.get("/getRoles", protectRoute, checkPermission("view_roles"), getRoles);
router.post("/createRole", protectRoute, checkPermission(["create_role", "role_permissions_manager"]), createRole);

export default router;
