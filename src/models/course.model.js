import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Course = sequelize.define("Course", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Untitled Course'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Beginner',
    validate: {
      isIn: [['Beginner', 'Intermediate', 'Advanced']]
    }
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '8 minggu'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General'
  },
  image: {
    type: DataTypes.STRING,
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

export default Course;

