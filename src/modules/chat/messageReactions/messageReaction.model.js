import { getPool} from "../../../config/db.js";

const MessageReaction = {
    find: async ({ messageId, userId, reaction }) => {
        const pool = getPool();
        const sql = `
      SELECT id
      FROM message_reactions
      WHERE message_id = ? AND user_id = ? AND reaction = ?
    `;
        const [rows] = await pool.query(sql, [
            messageId,
            userId,
            reaction,
        ]);
        return rows[0];
    },

    create: async ({ messageId, userId, reaction }) => {
        const pool = getPool();
        const sql = `
      INSERT INTO message_reactions (message_id, user_id, reaction)
      VALUES (?, ?, ?)
    `;
        return pool.query(sql, [messageId, userId, reaction]);
    },

    delete: async ({ messageId, userId, reaction }) => {
        const pool = getPool();
        const sql = `
      DELETE FROM message_reactions
      WHERE message_id = ? AND user_id = ? AND reaction = ?
    `;
        return pool.query(sql, [messageId, userId, reaction]);
    },
};

export default MessageReaction;
