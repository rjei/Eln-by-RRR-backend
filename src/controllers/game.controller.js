import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import GameScore from "../models/gameScore.model.js";
import UserStats from "../models/userStats.model.js";
import User from "../models/user.model.js";
import { sendResponse, sendError } from "../utils/response.js";

const { fn, col } = Sequelize;

export const saveGameScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameType, score, level, timeSpent } = req.body;

    if (!gameType || score === undefined) {
      return sendError(res, 400, "Game type dan score wajib diisi");
    }

    const validGameTypes = ['wordle', 'hangman', 'crossword', 'word-scramble'];
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

    // Update user points (1 point per score point)
    const stats = await UserStats.findOne({ where: { userId } });
    if (stats) {
      stats.points = (stats.points || 0) + score;
      await stats.save();
    }

    return sendResponse(res, 201, gameScore);
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

