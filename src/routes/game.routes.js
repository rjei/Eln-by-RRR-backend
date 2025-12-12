import { Router } from "express";
import { 
  saveGameScore, 
  getUserGameScores, 
  getLeaderboard 
} from "../controllers/game.controller.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/leaderboard", optionalAuth, getLeaderboard);

// Protected routes
router.post("/score", authenticateToken, saveGameScore);
router.get("/scores", authenticateToken, getUserGameScores);

export default router;

