import { getPool} from "../../config/db.js";

const ContentReplyReaction = {
    findOne: async ({ replyId, userId, reaction }) => {
        const pool = getPool();
        const sql = `
      SELECT id
      FROM content_reply_reactions
      WHERE reply_id = ? AND user_id = ? AND reaction = ?
      LIMIT 1
    `;
        const [rows] = await pool.query(sql, [replyId, userId, reaction]);
        return rows[0];
    },

    create: async ({ replyId, userId, reaction }) => {
        const pool = getPool();
        const sql = `
      INSERT INTO content_reply_reactions (reply_id, user_id, reaction)
      VALUES (?, ?, ?)
    `;
        return pool.query(sql, [replyId, userId, reaction]);
    },

    remove: async ({ replyId, userId, reaction }) => {
        const pool = getPool();
        const sql = `
      DELETE FROM content_reply_reactions
      WHERE reply_id = ? AND user_id = ? AND reaction = ?
    `;
        return pool.query(sql, [replyId, userId, reaction]);
    },

    getByReplyId: async (replyId) => {
        const pool = getPool();
        const sql = `
        SELECT user_id, reaction
        FROM content_reply_reactions
        WHERE reply_id = ?
    `;
        return pool.query(sql, [replyId]);
    }

};

export default ContentReplyReaction;
