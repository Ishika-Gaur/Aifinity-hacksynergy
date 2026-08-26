import express from "express";
import { getRoadmap } from "../controllers/roadmapController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/roadmap - Get personalized learning roadmap
router.get("/", authenticate, getRoadmap);

export default router;
