import { getPool } from "../../config/db.js";

const Content = {
  create: async ({ userId, url, platform, title, visibility }) => {
    const pool = getPool();
    const sql = `
      INSERT INTO contents (user_id, url, platform, title, visibility)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      userId,
      url,
      platform,
      title,
      visibility,
    ]);

    return {
      id: result.insertId,
      user_id: userId,
      url,
      platform,
      title,
      visibility,
    };
  },

  findById: async (contentId) => {
    const pool = getPool();
    const sql = `
      SELECT * FROM contents WHERE id = ?
    `;
    const [rows] = await pool.query(sql, [contentId]);
    return rows[0];
  },
};

export default Content;
