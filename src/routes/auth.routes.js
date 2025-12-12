import { Router } from "express";
import { login, register, getProfile } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected routes
router.get("/profile", authenticateToken, getProfile);

export default router;
