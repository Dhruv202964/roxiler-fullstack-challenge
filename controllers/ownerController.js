const { pool } = require('../server');

const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const storeQuery = await pool.query("SELECT id, name FROM stores WHERE owner_id = $1", [ownerId]);

        if (storeQuery.rows.length === 0) {
            return res.status(404).json({ error: "No store found for this owner." });
        }

        const storeId = storeQuery.rows[0].id;
        const storeName = storeQuery.rows[0].name;

        const avgQuery = await pool.query(
            "SELECT COALESCE(ROUND(AVG(rating), 1), 0) as average_rating FROM ratings WHERE store_id = $1",
            [storeId]
        );

        const usersQuery = await pool.query(
            `SELECT u.name, u.email, r.rating 
             FROM ratings r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.store_id = $1 
             ORDER BY r.rating DESC`,
            [storeId]
        );

        res.json({
            storeName,
            averageRating: parseFloat(avgQuery.rows[0].average_rating),
            reviews: usersQuery.rows
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error retrieving owner dashboard" });
    }
};

module.exports = { getOwnerDashboard };