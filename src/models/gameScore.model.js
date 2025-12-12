import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

const GameScore = sequelize.define("GameScore", {
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
  gameType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['wordle', 'hangman', 'crossword', 'word-scramble']]
    }
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true
  },
  timeSpent: {
    type: DataTypes.INTEGER, // in seconds
    defaultValue: 0
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

export default GameScore;

