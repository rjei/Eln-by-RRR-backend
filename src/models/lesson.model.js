import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Course from "./course.model.js";

const Lesson = sequelize.define("Lesson", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
 
  duration: {
    type: DataTypes.INTEGER, 
    defaultValue: 0
  },
  transcript: {
    type: DataTypes.JSONB,
    defaultValue: [],
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

export default Lesson;