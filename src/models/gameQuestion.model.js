import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const GameQuestion = sequelize.define("GameQuestion", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gameType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of game: wordle, hangman, scramble, crossword'
    },
    content: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'JSON content specific to game type'
        // Wordle: { word: "APPLE" }
        // Hangman: { word: "ELEPHANT", clue: "Large animal with trunk" }
        // Scramble: { word: "COMPUTER", hint: "Electronic device" }
    },
    difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        defaultValue: 'medium',
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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

export default GameQuestion;
