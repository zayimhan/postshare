import { getPool } from "../../config/db.js";

const ContentReply = {
  create: async ({ contentId, userId, message }) => {
    const pool = getPool();
    const sql = `
      INSERT INTO content_replies (content_id, user_id, message)
      VALUES (?, ?, ?)
    `;
    return pool.query(sql, [contentId, userId, message]);
  },

  getByContentId: async (contentId) => {
    const pool = getPool();
    const sql = `
      SELECT 
        cr.id,
        cr.message,
        cr.created_at,
        u.id AS user_id,
        u.email AS author
      FROM content_replies cr
      JOIN users u ON u.id = cr.user_id
      WHERE cr.content_id = ?
      ORDER BY cr.created_at ASC
    `;
    return pool.query(sql, [contentId]);
  },

  getById: async (replyId) => {
    const pool = getPool();
    const sql = `SELECT id, content_id, user_id, message, created_at
                 FROM content_replies WHERE id = ? LIMIT 1`;
    const [rows] = await pool.query(sql, [replyId]);
    return rows[0]; // Direkt objeyi döndür, servis rahatlasın
  },

};

export default ContentReply;
