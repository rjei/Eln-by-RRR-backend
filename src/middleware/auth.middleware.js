import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendError } from "../utils/response.js";

export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return sendError(res, 401, "Token tidak ditemukan. Silakan login terlebih dahulu.");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return sendError(res, 401, "User tidak ditemukan");
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return sendError(res, 401, "Token tidak valid");
    }
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, "Token telah kedaluwarsa. Silakan login kembali.");
    }
    
    console.error("Auth middleware error:", err);
    return sendError(res, 500, "Server error");
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        }
      } catch (err) {
        // Token invalid, but continue without user
      }
    }
    next();
  } catch (err) {
    next();
  }
};

