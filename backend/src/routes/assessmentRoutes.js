import express from "express";
import { createAssessment, getPublished, listAdmin, listPublished, removeAssessment, updateAssessment } from "../controllers/assessmentController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", listPublished);
router.get("/admin/all", authenticate, isAdmin, listAdmin);
router.post("/admin", authenticate, isAdmin, createAssessment);
router.put("/admin/:id", authenticate, isAdmin, updateAssessment);
router.delete("/admin/:id", authenticate, isAdmin, removeAssessment);
router.get("/:id", getPublished);
export default router;
