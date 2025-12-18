import Progress from "../models/progress.model.js";
import Lesson from "../models/lesson.model.js";
import Course from "../models/course.model.js";
import UserStats from "../models/userStats.model.js";
import Enrollment from "../models/enrollment.model.js";
import { sendResponse, sendError } from "../utils/response.js";

export const updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId, progress, completed, timeSpent } = req.body;

    console.log(`[updateProgress] userId: ${userId}, lessonId: ${lessonId}, completed: ${completed}`);

    if (!lessonId) {
      return sendError(res, 400, "Lesson ID wajib diisi");
    }

    // Get lesson to get courseId
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return sendError(res, 404, "Lesson tidak ditemukan");
    }

    // AUTO-ENROLL: Check if user is enrolled, if not, enroll them
    let enrollment = await Enrollment.findOne({
      where: {
        userId,
        courseId: lesson.courseId
      }
    });

    if (!enrollment) {
      console.log(`[updateProgress] Auto-enrolling user ${userId} to course ${lesson.courseId}`);
      enrollment = await Enrollment.create({
        userId,
        courseId: lesson.courseId,
        status: 'active',
        enrolledAt: new Date()
      });
    }

    // Find or create progress
    let userProgress = await Progress.findOne({
      where: {
        userId,
        lessonId,
        courseId: lesson.courseId
      }
    });

    // Track if this is the first time completing this lesson
    const wasAlreadyCompleted = userProgress?.completed || false;
    const isFirstTimeCompleted = completed && !wasAlreadyCompleted;

    if (userProgress) {
      // Update existing progress
      userProgress.progress = progress !== undefined ? progress : userProgress.progress;
      userProgress.completed = completed !== undefined ? completed : userProgress.completed;
      userProgress.timeSpent = timeSpent !== undefined ? timeSpent : userProgress.timeSpent;

      if (completed && !userProgress.completedAt) {
        userProgress.completedAt = new Date();
      }

      await userProgress.save();
      console.log(`[updateProgress] Updated progress for lesson ${lessonId}`);
    } else {
      // Create new progress
      userProgress = await Progress.create({
        userId,
        courseId: lesson.courseId,
        lessonId,
        progress: progress || 0,
        completed: completed || false,
        timeSpent: timeSpent || 0,
        completedAt: completed ? new Date() : null
      });
      console.log(`[updateProgress] Created new progress for lesson ${lessonId}`);
    }

    // Gamification: XP and Level Up
    let xpAdded = 0;
    let currentLevel = 1;
    let levelUp = false;

    if (isFirstTimeCompleted) {
      // Get or create user stats
      let stats = await UserStats.findOne({ where: { userId } });

      if (!stats) {
        stats = await UserStats.create({ userId });
      }

      // Calculate previous level
      const previousLevel = Math.floor(stats.points / 1000) + 1;

      // Add 50 XP for completing a lesson
      xpAdded = 50;
      stats.points = (stats.points || 0) + xpAdded;
      stats.lessonsCompleted = (stats.lessonsCompleted || 0) + 1;
      stats.totalTimeSpent = (stats.totalTimeSpent || 0) + (timeSpent || 0);

      // Calculate new level
      currentLevel = Math.floor(stats.points / 1000) + 1;
      levelUp = currentLevel > previousLevel;

      await stats.save();
    } else if (completed) {
      // Just get current stats for response
      const stats = await UserStats.findOne({ where: { userId } });
      if (stats) {
        currentLevel = Math.floor(stats.points / 1000) + 1;
        // Update time spent even if already completed
        stats.totalTimeSpent = (stats.totalTimeSpent || 0) + (timeSpent || 0);
        await stats.save();
      }
    }

    return sendResponse(res, 200, {
      progress: userProgress,
      xpAdded: xpAdded,
      currentLevel: currentLevel,
      levelUp: levelUp
    });
  } catch (err) {
    console.error("Update progress error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const whereClause = { userId };
    if (courseId) {
      whereClause.courseId = courseId;
    }

    const progressList = await Progress.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'Course',
          attributes: ['id', 'title']
        },
        {
          model: Lesson,
          as: 'Lesson',
          attributes: ['id', 'title', 'order']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    return sendResponse(res, 200, progressList);
  } catch (err) {
    console.error("Get user progress error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    let stats = await UserStats.findOne({ where: { userId } });

    if (!stats) {
      // Create stats if doesn't exist
      stats = await UserStats.create({ userId });
    }

    // Calculate total time in hours
    const totalHours = (stats.totalTimeSpent / 3600).toFixed(1);

    return sendResponse(res, 200, {
      lessonsCompleted: stats.lessonsCompleted,
      totalTimeSpent: `${totalHours} jam`,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      points: stats.points,
    });
  } catch (err) {
    console.error("Get user stats error:", err);
    return sendError(res, 500, "Server error");
  }
};

