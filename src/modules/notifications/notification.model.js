import { getPool } from "../../config/db.js";

const Notification = {
    create: async (userId, type, referenceId) => {
        const pool = getPool();
        const sql = `
      INSERT INTO notifications (user_id, type, reference_id)
      VALUES (?, ?, ?)
    `;
        return pool.query(sql, [userId, type, referenceId]);
    },

    getByUserId: async (userId) => {
        const pool = getPool();
        const sql = `
      SELECT id, type, reference_id, is_read, created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
        return pool.query(sql, [userId]);
    },

    markAsRead: async (userId, notificationIds) => {
        const pool = getPool();
        const sql = `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ?
        AND id IN (?)
    `;
        return pool.query(sql, [userId, notificationIds]);
    },

    getUnreadCount: async (userId) => {
        const pool = getPool();
        const sql = `
      SELECT COUNT(*) AS unread_count
      FROM notifications
      WHERE user_id = ?
        AND is_read = false
    `;
        return pool.query(sql, [userId]);
    },
};

export default Notification;
