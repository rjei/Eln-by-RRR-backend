import { Router } from "express";
import { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  getUserCourses 
} from "../controllers/course.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Protected routes
router.get("/user/my-courses", authenticateToken, getUserCourses);
router.post("/", authenticateToken, createCourse);

export default router;

