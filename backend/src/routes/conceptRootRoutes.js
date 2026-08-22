import express from "express";
import { getConceptRoot } from "../controllers/conceptRootController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All ConceptRoot routes require authentication
router.use(authenticate);

// GET /api/concept-root — personalized ConceptRoot analysis for the authenticated user
router.get("/", getConceptRoot);

export default router;
