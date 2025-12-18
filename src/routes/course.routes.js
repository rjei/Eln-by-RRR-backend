import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  getUserCourses,
  enrollCourse,
  getMyLearning,
  unenrollCourse,
  getEnrollmentStatus
} from "../controllers/course.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllCourses);

// Protected routes (must be before /:id to avoid conflicts)
router.get("/my-learning", authenticateToken, getMyLearning);
router.get("/user/my-courses", authenticateToken, getUserCourses);

// Enrollment routes (protected)
router.post("/:courseId/enroll", authenticateToken, enrollCourse);
router.delete("/:courseId/enroll", authenticateToken, unenrollCourse);
router.get("/:courseId/enrollment-status", authenticateToken, getEnrollmentStatus);

// Public - Get single course (must be last to avoid conflicts with other routes)
router.get("/:id", getCourseById);

// Admin route
router.post("/", authenticateToken, createCourse);

export default router;


