import express from "express";
import {
  deleteUser,
  listUsers,
  getAnalytics,
  listContent,
  createContent,
  deleteContent,
  listReports,
  getSettings,
  updateSettings,
} from "../controllers/adminController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authenticate, isAdmin);

// Users
router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);

// Platform Analytics & AI Telemetry
router.get("/analytics", getAnalytics);

// Learning Content
router.get("/content", listContent);
router.post("/content", createContent);
router.delete("/content/:id", deleteContent);

// Reports
router.get("/reports", listReports);

// Platform Settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

export default router;
