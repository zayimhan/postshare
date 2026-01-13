import { registerUser, loginUser } from "./auth.service.js";
import { findUserByEmail } from "./auth.model.js"; // gerekirse
import { getPool } from "../../config/db.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

export const me = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    const pool = getPool();
    console.log("POOL OK");

    const [rows] = await pool.query(
      "SELECT id, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    console.log("DB RESULT:", rows);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (err) {
    console.error("ME ERROR 👉", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
