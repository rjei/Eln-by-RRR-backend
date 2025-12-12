import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Course from "./course.model.js";
import Lesson from "./lesson.model.js";

const Progress = sequelize.define("Progress", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'id'
    }
  },
  lessonId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lesson,
      key: 'id'
    }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // percentage 0-100
    validate: {
      min: 0,
      max: 100
    }
  },
  timeSpent: {
    type: DataTypes.INTEGER, // in seconds
    defaultValue: 0
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

export default Progress;

