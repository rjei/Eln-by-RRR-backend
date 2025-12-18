import Course from "../models/course.model.js";
import Lesson from "../models/lesson.model.js";
import Progress from "../models/progress.model.js";
import Enrollment from "../models/enrollment.model.js";
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

/**
 * Enroll a user to a course
 * POST /api/courses/:courseId/enroll
 */
export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return sendError(res, 404, "Kursus tidak ditemukan");
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        userId,
        courseId
      }
    });

    if (existingEnrollment) {
      return sendError(res, 400, "Anda sudah terdaftar di kursus ini", {
        enrollment: existingEnrollment
      });
    }

    // Create new enrollment
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      status: 'active',
      enrolledAt: new Date()
    });

    // Return enrollment with course details
    const enrollmentWithCourse = await Enrollment.findByPk(enrollment.id, {
      include: [{
        model: Course,
        as: 'Course',
        include: [{
          model: Lesson,
          as: 'Lessons',
          attributes: ['id', 'title', 'order']
        }]
      }]
    });

    return sendResponse(res, 201, {
      message: "Berhasil mendaftar ke kursus",
      enrollment: enrollmentWithCourse
    });
  } catch (err) {
    console.error("Enroll course error:", err);
    return sendError(res, 500, "Server error");
  }
};

/**
 * Get user's enrolled courses with progress - This is the main "My Learning" endpoint
 * GET /api/courses/my-learning
 */
export const getMyLearning = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[getMyLearning] Fetching for userId: ${userId}`);

    // Get all enrollments for this user with course, lessons, and progress data
    const enrollments = await Enrollment.findAll({
      where: { userId },
      include: [{
        model: Course,
        as: 'Course',
        include: [{
          model: Lesson,
          as: 'Lessons',
          attributes: ['id', 'title', 'order', 'duration'],
          include: [{
            model: Progress,
            as: 'Progresses',
            where: { userId },
            required: false, // LEFT JOIN - include lessons even without progress
            attributes: ['id', 'completed', 'progress', 'completedAt']
          }]
        }]
      }],
      order: [['enrolledAt', 'DESC']]
    });

    console.log(`[getMyLearning] Found ${enrollments.length} enrollments`);

    // Calculate progress for each enrolled course
    const coursesWithProgress = enrollments.map((enrollment) => {
      const course = enrollment.Course;
      if (!course) {
        console.log(`[getMyLearning] Enrollment ${enrollment.id} has no course`);
        return null;
      }

      const lessons = course.Lessons || [];
      const totalLessons = lessons.length;

      // Sort lessons by order
      const sortedLessons = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0));

      // Count completed lessons (lessons that have at least one Progress with completed=true)
      const completedLessons = sortedLessons.filter(lesson => {
        const progresses = lesson.Progresses || [];
        return progresses.some(p => p.completed === true);
      }).length;

      // Get list of completed lesson IDs
      const completedLessonIds = sortedLessons
        .filter(lesson => {
          const progresses = lesson.Progresses || [];
          return progresses.some(p => p.completed === true);
        })
        .map(lesson => lesson.id);

      // Calculate progress percentage
      const progressPercent = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

      // Determine the next lesson ID to continue
      let nextLessonId = null;
      let lastLessonTitle = null;

      if (sortedLessons.length > 0) {
        // Find first incomplete lesson
        const nextLesson = sortedLessons.find(lesson => !completedLessonIds.includes(lesson.id));

        if (nextLesson) {
          // Found an incomplete lesson
          nextLessonId = nextLesson.id;
        } else {
          // All lessons completed, use the last lesson
          nextLessonId = sortedLessons[sortedLessons.length - 1].id;
        }

        // Get last accessed lesson (the one with most recent progress)
        const lessonsWithProgress = sortedLessons.filter(l => l.Progresses && l.Progresses.length > 0);
        if (lessonsWithProgress.length > 0) {
          // Sort by completedAt to find the most recent
          const sortedByRecent = lessonsWithProgress.sort((a, b) => {
            const aDate = a.Progresses[0]?.completedAt || new Date(0);
            const bDate = b.Progresses[0]?.completedAt || new Date(0);
            return new Date(bDate) - new Date(aDate);
          });
          lastLessonTitle = sortedByRecent[0]?.title || null;
        }
      }

      // Generate pseudo-random but consistent values based on course id
      const seed = course.id;
      const students = 500 + (seed * 137) % 2000;
      const rating = (4.5 + (seed * 0.07) % 0.5).toFixed(1);

      // Determine enrollment status
      const enrollmentStatus = progressPercent === 100 ? 'completed' : enrollment.status;

      console.log(`[getMyLearning] Course "${course.title}": ${completedLessons}/${totalLessons} (${progressPercent}%), nextLessonId: ${nextLessonId}`);

      return {
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        status: enrollmentStatus,
        completedAt: enrollment.completedAt,
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          level: course.level,
          duration: course.duration,
          category: course.category || 'General',
          image: course.image,
          students: students,
          rating: parseFloat(rating)
        },
        // Progress data - This is what frontend needs!
        progressPercent,
        completedLessons,
        totalLessons,
        lastLesson: lastLessonTitle,
        nextLessonId: nextLessonId
      };
    });

    // Filter out any null entries
    const validCourses = coursesWithProgress.filter(c => c !== null);

    console.log(`[getMyLearning] Returning ${validCourses.length} courses with progress`);
    return sendResponse(res, 200, validCourses);
  } catch (err) {
    console.error("Get my learning error:", err);
    return sendError(res, 500, "Server error");
  }
};

/**
 * Unenroll a user from a course
 * DELETE /api/courses/:courseId/enroll
 */
export const unenrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      where: {
        userId,
        courseId
      }
    });

    if (!enrollment) {
      return sendError(res, 404, "Anda tidak terdaftar di kursus ini");
    }

    // Delete the enrollment
    await enrollment.destroy();

    return sendResponse(res, 200, {
      message: "Berhasil keluar dari kursus"
    });
  } catch (err) {
    console.error("Unenroll course error:", err);
    return sendError(res, 500, "Server error");
  }
};

/**
 * Check if user is enrolled in a specific course
 * GET /api/courses/:courseId/enrollment-status
 */
export const getEnrollmentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      where: {
        userId,
        courseId
      }
    });

    return sendResponse(res, 200, {
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (err) {
    console.error("Get enrollment status error:", err);
    return sendError(res, 500, "Server error");
  }
};


