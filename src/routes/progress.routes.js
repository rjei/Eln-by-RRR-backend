import { Router } from "express";
import { 
  updateProgress, 
  getUserProgress, 
  getUserStats 
} from "../controllers/progress.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// All progress routes require authentication
router.post("/", authenticateToken, updateProgress);
router.get("/stats", authenticateToken, getUserStats);
router.get("/course/:courseId", authenticateToken, getUserProgress);
router.get("/", authenticateToken, getUserProgress);

export default router;

