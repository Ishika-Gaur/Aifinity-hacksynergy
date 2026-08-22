import express from "express";
import { getDashboard, updateCareerGoal } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All dashboard routes require authentication
// User identity is derived from the JWT cookie — never from a client-supplied userId
router.use(authenticate);

// GET /api/dashboard — aggregated dashboard data for the authenticated user
router.get("/", getDashboard);

// PUT /api/dashboard/career-goal — persist updated career goal for the authenticated user
router.put("/career-goal", updateCareerGoal);

export default router;
