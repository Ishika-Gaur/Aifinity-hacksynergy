import express from "express";
import { getSkillGap } from "../controllers/skillGapController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/skill-gap - Get personalized skill gap analysis
router.get("/", authenticate, getSkillGap);

export default router;
