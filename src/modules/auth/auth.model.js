import { getPool } from "../../config/db.js";

export const findUserByEmail = async (email) => {
  const pool = getPool();

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  return rows[0] || null;
};

export const createUser = async ({ email, passwordHash }) => {
  const pool = getPool();

  const [result] = await pool.query(
    "INSERT INTO users (email, password_hash) VALUES (?, ?)",
    [email, passwordHash]
  );

  return result.insertId;
};
