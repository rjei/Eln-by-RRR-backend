import Course from "../models/course.model.js";
import Lesson from "../models/lesson.model.js";
import Progress from "../models/progress.model.js";
import { sendResponse, sendError } from "../utils/response.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: Lesson,
        as: 'Lessons',
        attributes: ['id']
      }]
    });

    // Calculate lesson count and add virtual computed fields
    const coursesWithCount = courses.map(course => {
      const courseData = course.toJSON();
      const lessonsCount = course.Lessons?.length || 0;

      // Generate pseudo-random but consistent values based on course id
      const seed = courseData.id;
      const students = 500 + (seed * 137) % 2000; // 500-2500 range
      const rating = (4.5 + (seed * 0.07) % 0.5).toFixed(1); // 4.5-5.0 range

      return {
        ...courseData,
        lessons: lessonsCount,
        students: students,
        rating: parseFloat(rating),
        category: courseData.category || 'General'
      };
    });

    return sendResponse(res, 200, coursesWithCount);
  } catch (err) {
    console.error("Get courses error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [{
        model: Lesson,
        as: 'Lessons',
        order: [['order', 'ASC']]
      }]
    });

    if (!course) {
      return sendError(res, 404, "Course tidak ditemukan");
    }

    const courseData = course.toJSON();
    const lessonsCount = course.Lessons?.length || 0;

    // Generate pseudo-random but consistent values based on course id
    const seed = courseData.id;
    const students = 500 + (seed * 137) % 2000;
    const rating = (4.5 + (seed * 0.07) % 0.5).toFixed(1);

    return sendResponse(res, 200, {
      ...courseData,
      lessons: lessonsCount,
      students: students,
      rating: parseFloat(rating),
      category: courseData.category || 'General'
    });
  } catch (err) {
    console.error("Get course error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, level, duration, image } = req.body;

    if (!title || !description || !level || !duration) {
      return sendError(res, 400, "Semua field wajib diisi");
    }

    const course = await Course.create({
      title,
      description,
      level,
      duration,
      image: image || null
    });

    return sendResponse(res, 201, course);
  } catch (err) {
    console.error("Create course error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const getUserCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all courses with user progress
    const courses = await Course.findAll({
      include: [{
        model: Lesson,
        as: 'Lessons',
        attributes: ['id']
      }]
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const userProgress = await Progress.findAll({
          where: {
            userId,
            courseId: course.id,
            completed: true
          },
          attributes: ['lessonId']
        });

        const completedLessons = userProgress.length;
        const totalLessons = course.Lessons?.length || 0;
        const progress = totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

        // Get last lesson
        const lastProgress = await Progress.findOne({
          where: {
            userId,
            courseId: course.id
          },
          order: [['updatedAt', 'DESC']],
          include: [{
            model: Lesson,
            as: 'Lesson',
            attributes: ['title']
          }]
        });

        return {
          ...course.toJSON(),
          lessons: totalLessons,
          progress,
          completedLessons,
          lastLesson: lastProgress?.Lesson?.title || null
        };
      })
    );

    return sendResponse(res, 200, coursesWithProgress);
  } catch (err) {
    console.error("Get user courses error:", err);
    return sendError(res, 500, "Server error");
  }
};

