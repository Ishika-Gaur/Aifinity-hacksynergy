import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { chatWithPI } from "../controllers/personalIntelligenceController.js";

const router = express.Router();

router.post("/chat", authenticate, chatWithPI);

export default router;
