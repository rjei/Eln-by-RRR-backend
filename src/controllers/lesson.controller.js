import Lesson from "../models/lesson.model.js";
import Course from "../models/course.model.js";
import Progress from "../models/progress.model.js";
import { sendResponse, sendError } from "../utils/response.js";

export const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.findAll({
      where: { courseId },
      order: [['order', 'ASC']],
      include: [{
        model: Course,
        as: 'Course',
        attributes: ['id', 'title']
      }]
    });

    return sendResponse(res, 200, lessons);
  } catch (err) {
    console.error("Get lessons error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const lesson = await Lesson.findByPk(id, {
      include: [{
        model: Course,
        as: 'Course',
        attributes: ['id', 'title']
      }]
    });

    if (!lesson) {
      return sendError(res, 404, "Lesson tidak ditemukan");
    }

    let userProgress = null;
    if (userId) {
      userProgress = await Progress.findOne({
        where: {
          userId,
          lessonId: id
        }
      });
    }

    const lessonData = lesson.toJSON();

    return sendResponse(res, 200, {
      ...lessonData,
      transcript: lessonData.transcript || [],
      userProgress: userProgress
        ? {
          completed: userProgress.completed,
          progress: userProgress.progress,
          timeSpent: userProgress.timeSpent,
        }
        : null,
    });
  } catch (err) {
    console.error("Get lesson error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const createLesson = async (req, res) => {
  try {
    const { courseId, title, content, order, duration, transcript } = req.body;

    if (!courseId || !title || !content || order === undefined) {
      return sendError(res, 400, "Course ID, title, content, dan order wajib diisi");
    }

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return sendError(res, 404, "Course tidak ditemukan");
    }

    const lesson = await Lesson.create({
      courseId,
      title,
      content,
      order,
      duration: duration || 0,
      transcript: transcript || []
    });

    return sendResponse(res, 201, lesson);
  } catch (err) {
    console.error("Create lesson error:", err);
    return sendError(res, 500, "Server error");
  }
};

