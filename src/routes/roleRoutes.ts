import express from "express";
import { createRole, deleteRole, editRole, getRoleDetail, getRoles, getSingleRolePermissions } from "../controllers/roleController";
import { protectRoute } from "../middleware/protectRoute";
import { checkPermission } from "../middleware/checkPermission";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = express.Router();

router.get("/getRoles", protectRoute, checkPermission("view_roles"), getRoles);
router.get("/rolePermissions/:roleId", protectRoute, checkPermission("view_roles"), getSingleRolePermissions);
router.get("/roleDetails/:roleId", protectRoute, checkPermission(["view_roles", "role_permissions_manager"]), getRoleDetail);
router.post("/createRole", protectRoute, checkPermission(["create_role", "role_permissions_manager"]), authenticateJWT, createRole);
router.put("/editRole/:roleId", protectRoute, checkPermission(["edit_role", "role_permissions_manager"]), authenticateJWT, editRole);
router.delete("/deleteRole/:roleId", protectRoute, checkPermission(["delete_role", "role_permissions_manager"]), authenticateJWT, deleteRole);

export default router;
