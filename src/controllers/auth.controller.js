import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import UserStats from "../models/userStats.model.js";
import { sendResponse, sendError } from "../utils/response.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return sendError(res, 400, "Nama, email, dan password wajib diisi");
    }

    if (password.length < 6) {
      return sendError(res, 400, "Password minimal 6 karakter");
    }

    // Check if user exists
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return sendError(res, 400, "Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create user stats
    await UserStats.create({
      userId: user.id
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendResponse(res, 201, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return sendError(
      res,
      500,
      "Server error",
      process.env.NODE_ENV === "development" ? { detail: err.message } : {}
    );
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return sendError(res, 400, "Email dan password wajib diisi");
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return sendError(res, 401, "Email atau password salah");
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendError(res, 401, "Email atau password salah");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendResponse(res, 200, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return sendError(
      res,
      500,
      "Server error",
      process.env.NODE_ENV === "development" ? { detail: err.message } : {}
    );
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return sendError(res, 404, "User tidak ditemukan");
    }

    return sendResponse(res, 200, user);
  } catch (err) {
    console.error("Get profile error:", err);
    return sendError(res, 500, "Server error");
  }
};
