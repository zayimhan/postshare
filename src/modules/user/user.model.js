import { getPool } from "../../config/db.js";

const User = {
    findById: async (id) => {
        const pool = getPool();
        const sql = `SELECT id FROM users WHERE id = ?`;
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    },
};

export default User;
