import { Router } from "express";
import { 
  getLessonsByCourse, 
  getLessonById, 
  createLesson 
} from "../controllers/lesson.controller.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes (with optional auth for progress)
router.get("/course/:courseId", getLessonsByCourse);
router.get("/:id", optionalAuth, getLessonById);

// Protected routes
router.post("/", authenticateToken, createLesson);

export default router;

