import { getPool } from "../../config/db.js";

const Feed = {
    // 🔹 TEK FEED GETİR (findById)
    findById: async (id) => {
        const pool = getPool();

        const [rows] = await pool.query(
            `
            SELECT 
                c.id,
                c.user_id,
                c.platform,
                c.url,
                c.title,
                c.created_at,
                (
                  SELECT COUNT(*)
                  FROM content_replies cr
                  WHERE cr.content_id = c.id
                ) AS reply_count
            FROM contents c
            WHERE c.id = ?
            LIMIT 1
            `,
            [id]
        );

        return rows[0]; // undefined olabilir → controller/service kontrol eder
    },

    // 🔹 FEED LİSTESİ (mevcut kodun)
    getFeed: async ({
                        userId,
                        friendIds = [],
                        includePlatforms = [],
                        excludePlatforms = [],
                        includeFriends = [],
                        excludeFriends = [],
                        limit = 20,
                        offset = 0,
                    }) => {
        const pool = getPool();

        const where = [];
        const params = [];

        // 🔒 BASE FEED: ben + arkadaşlarım
        const baseIds = [userId, ...friendIds];
        const basePlaceholders = baseIds.map(() => "?").join(",");

        where.push(`c.user_id IN (${basePlaceholders})`);
        params.push(...baseIds);

        // ✅ Platform include
        if (includePlatforms.length > 0) {
            where.push(
                `c.platform IN (${includePlatforms.map(() => "?").join(",")})`
            );
            params.push(...includePlatforms);
        }

        // ❌ Platform exclude
        if (excludePlatforms.length > 0) {
            where.push(
                `c.platform NOT IN (${excludePlatforms.map(() => "?").join(",")})`
            );
            params.push(...excludePlatforms);
        }

        // 👤 Friend include
        if (includeFriends.length > 0) {
            where.push(
                `c.user_id IN (${includeFriends.map(() => "?").join(",")})`
            );
            params.push(...includeFriends);
        }

        // 🚫 Friend exclude
        if (excludeFriends.length > 0) {
            where.push(
                `c.user_id NOT IN (${excludeFriends.map(() => "?").join(",")})`
            );
            params.push(...excludeFriends);
        }

        const sql = `
            SELECT 
                c.id,
                c.user_id,
                c.platform,
                c.url,
                c.title,
                c.created_at,
                (
                  SELECT COUNT(*)
                  FROM content_replies cr
                  WHERE cr.content_id = c.id
                ) AS reply_count
            FROM contents c
            WHERE ${where.join(" AND ")}
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?
        `;

        params.push(limit, offset);

        const [rows] = await pool.query(sql, params);
        return rows;
    },
};

export default Feed;
