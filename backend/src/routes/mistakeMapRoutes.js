import express from "express";
import { getMistakeMap } from "../controllers/mistakeMapController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All MistakeMap routes require authentication
router.use(authenticate);

// GET /api/mistake-map — personalized Mistake Map analysis for the authenticated user
router.get("/", getMistakeMap);

export default router;
