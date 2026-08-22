import express from "express";
import { deleteUser, listUsers } from "../controllers/adminController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authenticate, isAdmin);
router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);
export default router;
