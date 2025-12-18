import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import GameScore from "../models/gameScore.model.js";
import UserStats from "../models/userStats.model.js";
import User from "../models/user.model.js";
import GameQuestion from "../models/gameQuestion.model.js";
import { sendResponse, sendError } from "../utils/response.js";

const { fn, col } = Sequelize;

export const saveGameScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameType, score, level, timeSpent } = req.body;

    if (!gameType || score === undefined) {
      return sendError(res, 400, "Game type dan score wajib diisi");
    }

    const validGameTypes = ['wordle', 'hangman', 'crossword', 'word-scramble', 'scramble'];
    if (!validGameTypes.includes(gameType)) {
      return sendError(res, 400, "Game type tidak valid");
    }

    const gameScore = await GameScore.create({
      userId,
      gameType,
      score,
      level: level || null,
      timeSpent: timeSpent || 0
    });

    // Level Up Logic
    let xpAdded = score;
    let oldLevel = 1;
    let newLevel = 1;
    let isLevelUp = false;

    // Update user points and calculate level
    let stats = await UserStats.findOne({ where: { userId } });

    if (!stats) {
      // Create stats if not exists
      stats = await UserStats.create({
        userId,
        points: 0,
        lessonsCompleted: 0,
        totalTimeSpent: 0
      });
    }

    // Calculate old level before adding points
    const oldPoints = stats.points || 0;
    oldLevel = Math.floor(oldPoints / 500) + 1;

    // Add new points
    stats.points = oldPoints + score;
    await stats.save();

    // Calculate new level after adding points
    newLevel = Math.floor(stats.points / 500) + 1;
    isLevelUp = newLevel > oldLevel;

    console.log(`[saveGameScore] User ${userId}: +${score} XP, Total: ${stats.points}, Level: ${oldLevel} -> ${newLevel}, LevelUp: ${isLevelUp}`);

    return sendResponse(res, 201, {
      gameScore,
      xpAdded: xpAdded,
      totalPoints: stats.points,
      oldLevel: oldLevel,
      newLevel: newLevel,
      isLevelUp: isLevelUp,
      msg: isLevelUp ? `Level Up! Anda sekarang Level ${newLevel}!` : "Score saved successfully"
    });
  } catch (err) {
    console.error("Save game score error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const getUserGameScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameType } = req.query;

    const whereClause = { userId };
    if (gameType) {
      whereClause.gameType = gameType;
    }

    const scores = await GameScore.findAll({
      where: whereClause,
      order: [['score', 'DESC'], ['createdAt', 'DESC']],
      limit: 50
    });

    return sendResponse(res, 200, scores);
  } catch (err) {
    console.error("Get game scores error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { gameType } = req.query;

    const whereClause = {};
    if (gameType) {
      whereClause.gameType = gameType;
    }

    // Get top scores
    const topScores = await GameScore.findAll({
      where: whereClause,
      attributes: [
        'userId',
        'gameType',
        [fn('MAX', col('score')), 'maxScore'],
        [fn('COUNT', col('id')), 'gamesPlayed']
      ],
      group: ['userId', 'gameType'],
      order: [[fn('MAX', col('score')), 'DESC']],
      limit: 10,
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'name', 'email']
      }]
    });

    return sendResponse(res, 200, topScores);
  } catch (err) {
    console.error("Get leaderboard error:", err);
    return sendError(res, 500, "Server error");
  }
};

/**
 * Get a random question for a specific game type
 * GET /api/games/:gameType/question
 */
export const getQuestion = async (req, res) => {
  try {
    const { gameType } = req.params;
    const { difficulty } = req.query;

    // Validate game type
    const validGameTypes = ['wordle', 'hangman', 'scramble', 'crossword'];
    if (!validGameTypes.includes(gameType)) {
      return sendError(res, 400, "Game type tidak valid. Gunakan: wordle, hangman, scramble, crossword");
    }

    // Build where clause
    const whereClause = {
      gameType,
      isActive: true
    };

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      whereClause.difficulty = difficulty;
    }

    // Get random question using ORDER BY RANDOM()
    const question = await GameQuestion.findOne({
      where: whereClause,
      order: sequelize.random()
    });

    if (!question) {
      return sendError(res, 404, `Tidak ada soal untuk game ${gameType}`);
    }

    // Return question data (without revealing unnecessary info)
    return sendResponse(res, 200, {
      id: question.id,
      gameType: question.gameType,
      difficulty: question.difficulty,
      content: question.content
    });
  } catch (err) {
    console.error("Get question error:", err);
    return sendError(res, 500, "Server error");
  }
};

/**
 * Get all questions for a game type (for games that need multiple questions)
 * GET /api/games/:gameType/questions
 */
export const getQuestions = async (req, res) => {
  try {
    const { gameType } = req.params;
    const { difficulty, limit = 10 } = req.query;

    const validGameTypes = ['wordle', 'hangman', 'scramble', 'crossword'];
    if (!validGameTypes.includes(gameType)) {
      return sendError(res, 400, "Game type tidak valid");
    }

    const whereClause = {
      gameType,
      isActive: true
    };

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      whereClause.difficulty = difficulty;
    }

    const questions = await GameQuestion.findAll({
      where: whereClause,
      order: sequelize.random(),
      limit: parseInt(limit)
    });

    return sendResponse(res, 200, questions.map(q => ({
      id: q.id,
      gameType: q.gameType,
      difficulty: q.difficulty,
      content: q.content
    })));
  } catch (err) {
    console.error("Get questions error:", err);
    return sendError(res, 500, "Server error");
  }
};
