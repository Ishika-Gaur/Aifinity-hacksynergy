import express from "express";
import {
  getSkillGapAnalytics,
  getMistakeMapAnalytics,
  getConceptRootAnalytics,
  getRoadmapAnalytics,
  updateUserRoadmap,
} from "../controllers/analyticsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All analytics routes require authentication
router.use(authenticate);

router.get("/skill-gap", getSkillGapAnalytics);
router.get("/mistake-map", getMistakeMapAnalytics);
router.get("/concept-root", getConceptRootAnalytics);
router.get("/roadmap", getRoadmapAnalytics);
router.put("/roadmap", updateUserRoadmap);

export default router;
