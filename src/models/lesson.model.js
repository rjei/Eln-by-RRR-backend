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
    allowNull: true,
    comment: 'Main lesson content/text'
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
    type: DataTypes.STRING, // Changed to STRING to store "5 menit", "12 menit" etc.
    allowNull: true,
    defaultValue: "0 menit"
  },
  transcript: {
    type: DataTypes.JSONB,
    defaultValue: [],
    allowNull: true,
    comment: 'Array of transcript segments with startTime, endTime, text, speaker'
  },
  // New column for structured lesson data (vocabulary & quiz)
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Structured data containing vocabulary array and quiz object'
    // Structure:
    // {
    //   vocabulary: [{ word: string, meaning: string, example: string }],
    //   quiz: { question: string, options: string[], correctAnswer: number }
    // }
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