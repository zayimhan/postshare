import { getPool } from "../../config/db.js";

const Friendship = {
  create: async (requesterId, addresseeId) => {
    const pool = getPool();
    const sql = `
      INSERT INTO friendships (requester_id, addressee_id)
      VALUES (?, ?)
    `;
    return pool.query(sql, [requesterId, addresseeId]);
  },

  cancel: async (requesterId, addresseeId) => {
    const pool = getPool();
    const sql = `
    DELETE FROM friendships
    WHERE requester_id = ?
      AND addressee_id = ?
      AND status = 'pending'
  `;
    return pool.query(sql, [requesterId, addresseeId]);
  },


  findBetweenUsers: async (userA, userB) => {
    const pool = getPool();
    const sql = `
      SELECT * FROM friendships
      WHERE 
        (requester_id = ? AND addressee_id = ?)
        OR
        (requester_id = ? AND addressee_id = ?)
    `;
    return pool.query(sql, [userA, userB, userB, userA]);
  },

  getPendingRequestsForUser: async (userId) => {
    const pool = getPool();
    const sql = `
    SELECT id, requester_id, created_at
    FROM friendships
    WHERE addressee_id = ?
      AND status = 'pending'
  `;
    return pool.query(sql, [userId]);
  },

  accept: async (requesterId, addresseeId) => {
    const pool = getPool();
    const sql = `
      UPDATE friendships
      SET status = 'accepted'
      WHERE requester_id = ? AND addressee_id = ?
    `;
    return pool.query(sql, [requesterId, addresseeId]);
  },

  reject: async (requesterId, addresseeId) => {
    const pool = getPool();
    const sql = `
    DELETE FROM friendships
    WHERE requester_id = ?
      AND addressee_id = ?
      AND status = 'pending'
  `;
    return pool.query(sql, [requesterId, addresseeId]);
  },

  getFriendsOfUser: async (userId) => {
    const pool = getPool();
    const sql = `
      SELECT 
        CASE 
          WHEN requester_id = ? THEN addressee_id
          ELSE requester_id
        END AS friend_id
      FROM friendships
      WHERE status = 'accepted'
        AND (requester_id = ? OR addressee_id = ?)
    `;
    return pool.query(sql, [userId, userId, userId]);
  },
};

export default Friendship;
