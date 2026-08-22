import express from "express";
import {
  createAssessment,
  getPublished,
  listAdmin,
  listPublished,
  removeAssessment,
  startAttempt,
  submitAttempt,
  updateAssessment,
} from "../controllers/assessmentController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", listPublished);
router.get("/admin/all", authenticate, isAdmin, listAdmin);
router.post("/admin", authenticate, isAdmin, createAssessment);
router.put("/admin/:id", authenticate, isAdmin, updateAssessment);
router.delete("/admin/:id", authenticate, isAdmin, removeAssessment);
router.get("/:id", getPublished);
// authenticate on start/submit so req.user is available for attempt persistence
router.get("/:id/start", authenticate, startAttempt);
router.post("/:id/submit", authenticate, submitAttempt);

export default router;
