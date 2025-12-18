// Import all models
import User from "./user.model.js";
import Course from "./course.model.js";
import Lesson from "./lesson.model.js";
import Progress from "./progress.model.js";
import GameScore from "./gameScore.model.js";
import UserStats from "./userStats.model.js";
import Enrollment from "./enrollment.model.js";
import GameQuestion from "./gameQuestion.model.js";

// Define associations
// Course - Lesson (One to Many)
Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'Lessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'Course' });

// User - Progress (One to Many)
User.hasMany(Progress, { foreignKey: 'userId', as: 'Progresses' });
Progress.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// Course - Progress (One to Many)
Course.hasMany(Progress, { foreignKey: 'courseId', as: 'Progresses' });
Progress.belongsTo(Course, { foreignKey: 'courseId', as: 'Course' });

// Lesson - Progress (One to Many)
Lesson.hasMany(Progress, { foreignKey: 'lessonId', as: 'Progresses' });
Progress.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'Lesson' });

// User - GameScore (One to Many)
User.hasMany(GameScore, { foreignKey: 'userId', as: 'GameScores' });
GameScore.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// User - UserStats (One to One)
User.hasOne(UserStats, { foreignKey: 'userId', as: 'Stats' });
UserStats.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// User - Course (Many to Many through Enrollment)
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'userId',
  otherKey: 'courseId',
  as: 'EnrolledCourses'
});
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: 'courseId',
  otherKey: 'userId',
  as: 'EnrolledUsers'
});

// Direct associations for Enrollment (for easier querying with include)
User.hasMany(Enrollment, { foreignKey: 'userId', as: 'Enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'User' });

Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'Enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'Course' });

export {
  User,
  Course,
  Lesson,
  Progress,
  GameScore,
  UserStats,
  Enrollment,
  GameQuestion
};
