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
      attributes: ['id', 'courseId', 'title', 'duration', 'order', 'videoUrl', 'thumbnail'],
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
        attributes: ['id', 'title', 'level']
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
          lessonId: id,
          courseId: lesson.courseId
        }
      });
    }

    const lessonData = lesson.toJSON();

    // Extract vocabulary and quiz from the data column
    const vocabularyData = lessonData.data?.vocabulary || [];
    const quizData = lessonData.data?.quiz || null;

    return sendResponse(res, 200, {
      id: lessonData.id,
      courseId: lessonData.courseId,
      title: lessonData.title,
      duration: lessonData.duration,
      order: lessonData.order,
      videoUrl: lessonData.videoUrl,
      thumbnail: lessonData.thumbnail,
      // Main content
      content: lessonData.content,
      // Transcript for video lessons
      transcript: lessonData.transcript || [],
      // Structured data for frontend
      vocabulary: vocabularyData,
      quiz: quizData,
      // Course info
      Course: lessonData.Course,
      // User progress
      userProgress: userProgress
        ? {
          completed: userProgress.completed,
          progress: userProgress.progress,
          timeSpent: userProgress.timeSpent,
        }
        : null,
      createdAt: lessonData.createdAt,
      updatedAt: lessonData.updatedAt,
    });
  } catch (err) {
    console.error("Get lesson error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const createLesson = async (req, res) => {
  try {
    const {
      courseId,
      title,
      content,
      order,
      duration,
      videoUrl,
      thumbnail,
      transcript,
      data // { vocabulary: [], quiz: {} }
    } = req.body;

    if (!courseId || !title || order === undefined) {
      return sendError(res, 400, "Course ID, title, dan order wajib diisi");
    }

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return sendError(res, 404, "Course tidak ditemukan");
    }

    const lesson = await Lesson.create({
      courseId,
      title,
      content: content || '',
      order,
      duration: duration || "0 menit",
      videoUrl: videoUrl || null,
      thumbnail: thumbnail || null,
      transcript: transcript || [],
      data: data || {}
    });

    return sendResponse(res, 201, lesson);
  } catch (err) {
    console.error("Create lesson error:", err);
    return sendError(res, 500, "Server error");
  }
};

/**
 * Update a lesson
 * PUT /api/lessons/:id
 */
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      order,
      duration,
      videoUrl,
      thumbnail,
      transcript,
      data
    } = req.body;

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return sendError(res, 404, "Lesson tidak ditemukan");
    }

    await lesson.update({
      title: title !== undefined ? title : lesson.title,
      content: content !== undefined ? content : lesson.content,
      order: order !== undefined ? order : lesson.order,
      duration: duration !== undefined ? duration : lesson.duration,
      videoUrl: videoUrl !== undefined ? videoUrl : lesson.videoUrl,
      thumbnail: thumbnail !== undefined ? thumbnail : lesson.thumbnail,
      transcript: transcript !== undefined ? transcript : lesson.transcript,
      data: data !== undefined ? data : lesson.data
    });

    return sendResponse(res, 200, lesson);
  } catch (err) {
    console.error("Update lesson error:", err);
    return sendError(res, 500, "Server error");
  }
};

/**
 * Delete a lesson
 * DELETE /api/lessons/:id
 */
export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return sendError(res, 404, "Lesson tidak ditemukan");
    }

    await lesson.destroy();

    return sendResponse(res, 200, { message: "Lesson berhasil dihapus" });
  } catch (err) {
    console.error("Delete lesson error:", err);
    return sendError(res, 500, "Server error");
  }
};


