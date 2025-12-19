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

// ================== PERBAIKAN CORS (WAJIB) ==================
// Mengizinkan domain Vercel dan Localhost agar tidak kena blokir
app.use(cors({
  origin: "*", // Pakai "*" untuk mengizinkan semua domain saat demo
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
}));

// Tangani request OPTIONS (Preflight)
app.options("*", cors());
// ============================================================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Halaman depan untuk memastikan backend hidup
app.get("/", (req, res) => {
  res.json({ message: "Backend English E-Learning is Running! 🚀" });
});

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
