import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import "./config/db.js";
import "./models/index.js"; // Initialize all models and associations
import { sendResponse, sendError } from "./utils/response.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import gameRoutes from "./routes/game.routes.js";

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) =>
  sendResponse(res, 200, { timestamp: new Date().toISOString() })
);

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/games", gameRoutes);

// 404 handler
app.use((req, res) => sendError(res, 404, "Endpoint tidak ditemukan"));

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  return sendError(
    res,
    500,
    "Internal server error",
    process.env.NODE_ENV === "development" ? { detail: err.message } : {}
  );
});

export default app;
