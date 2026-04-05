import { getPool} from "../../../config/db.js";

const Message = {
    create: async ({ conversationId, userId, type, content }) => {
        const pool = getPool();
        const sql = `
      INSERT INTO messages (conversation_id, sender_id, type, content)
      VALUES (?, ?, ?, ?)
    `;
        return pool.query(sql, [
            conversationId,
            userId,
            type,
            content,
        ]);
    },

    getByConversationIdWithReactions: async ({
                                                 conversationId,
                                                 userId,
                                                 limit = 20,
                                                 offset = 0,
                                             }) => {
        const pool = getPool();

        const sql = `
            SELECT
                m.id,
                m.type,
                m.content,
                m.created_at,
                u.id AS sender_id,
                u.email AS sender,

                COALESCE(r.reactions, JSON_OBJECT()) AS reactions,

                GROUP_CONCAT(
                        CASE
                            WHEN mr.user_id = ?
                                THEN mr.reaction
                            END
                ) AS my_reactions

            FROM messages m
                     JOIN users u ON u.id = m.sender_id

                     LEFT JOIN (
                SELECT
                    message_id,
                    JSON_OBJECTAGG(reaction, cnt) AS reactions
                FROM (
                         SELECT message_id, reaction, COUNT(*) AS cnt
                         FROM message_reactions
                         GROUP BY message_id, reaction
                     ) t
                GROUP BY message_id
            ) r ON r.message_id = m.id

                     LEFT JOIN message_reactions mr
                               ON mr.message_id = m.id AND mr.user_id = ?

            WHERE m.conversation_id = ?

            GROUP BY m.id
            ORDER BY m.created_at DESC
                LIMIT ? OFFSET ?;

        `;

        return pool.query(sql, [
            userId,
            userId,
            conversationId,
            limit,
            offset,
        ]);
    },
};

export default Message;
