const pool = require('../db');

const getOwnerStores = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const storesQuery = await pool.query(`
            SELECT s.id, s.name, s.address, s.email, 
            COALESCE(ROUND(AVG(r.rating), 1), 0) as average_rating,
            COUNT(r.id) as total_reviews
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = $1
            GROUP BY s.id
            ORDER BY s.id DESC
        `, [ownerId]);
        res.json(storesQuery.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching owner stores' });
    }
};

const createStore = async (req, res) => {
    try {
        const { name, address, email } = req.body;
        const ownerId = req.user.id;
        
        const newStore = await pool.query(
            'INSERT INTO stores (name, address, email, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, address, email, ownerId]
        );
        
        res.status(201).json({
            ...newStore.rows[0],
            average_rating: 0,
            total_reviews: 0
        });
    } catch (err) {
        console.error("DATABASE ERROR:", err.message);
        res.status(500).json({ error: 'Server error creating store' });
    }
};

const getStoreReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user.id;

        const reviewsQuery = await pool.query(`
            SELECT r.id, r.rating, r.review_text, r.verified_visit, u.name as reviewer_name
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            WHERE r.store_id = $1 AND s.owner_id = $2
            ORDER BY r.id DESC
        `, [id, ownerId]);

        res.json(reviewsQuery.rows);
    } catch (err) {
        console.error("FETCH REVIEWS ERROR:", err.message);
        res.status(500).json({ error: 'Server error fetching reviews' });
    }
};

module.exports = { getOwnerStores, createStore, getStoreReviews };