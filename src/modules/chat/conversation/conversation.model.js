import { getPool} from "../../../config/db.js";

const Conversation = {
    findBetweenUsers: async (userA, userB) => {
        const pool = getPool();
        const user1 = Math.min(userA, userB);
        const user2 = Math.max(userA, userB);

        const sql = `
      SELECT *
      FROM conversations
      WHERE user1_id = ? AND user2_id = ?
      LIMIT 1
    `;

        const [rows] = await pool.query(sql, [user1, user2]);
        return rows[0];
    },

    findById: async (conversationId) => {
        const pool = getPool();

        const sql = `
      SELECT *
      FROM conversations
      WHERE id = ?
      LIMIT 1
    `;

        const [rows] = await pool.query(sql, [conversationId]);
        return rows[0];
    },

    create: async (userA, userB) => {
        const pool = getPool();
        const user1 = Math.min(userA, userB);
        const user2 = Math.max(userA, userB);

        const sql = `
      INSERT INTO conversations (user1_id, user2_id)
      VALUES (?, ?)
    `;

        const [result] = await pool.query(sql, [user1, user2]);

        return {
            id: result.insertId,
            user1_id: user1,
            user2_id: user2,
        };
    },
};

export default Conversation;
