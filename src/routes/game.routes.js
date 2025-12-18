import { Router } from "express";
import {
  saveGameScore,
  getUserGameScores,
  getLeaderboard,
  getQuestion,
  getQuestions
} from "../controllers/game.controller.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes - Get game questions (no auth needed)
router.get("/:gameType/question", getQuestion);  // Get single random question
router.get("/:gameType/questions", getQuestions); // Get multiple questions

// Public routes
router.get("/leaderboard", optionalAuth, getLeaderboard);

// Protected routes
router.post("/score", authenticateToken, saveGameScore);
router.get("/scores", authenticateToken, getUserGameScores);

export default router;
