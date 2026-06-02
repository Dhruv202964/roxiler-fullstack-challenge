const pool = require('../db');

const getStores = async (req, res) => {
    try {
        const { search, sortBy, order } = req.query;
        let query = "SELECT id, name, address, email FROM stores WHERE 1=1";
        const values = [];
        let count = 1;

        if (search) {
            query += ` AND (name ILIKE $${count} OR address ILIKE $${count})`;
            values.push(`%${search}%`);
            count++;
        }

        const validColumns = ['name', 'address'];
        const sortColumn = validColumns.includes(sortBy) ? sortBy : 'id';
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

        query += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const stores = await pool.query(query, values);
        res.json(stores.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error retrieving stores" });
    }
};

const submitRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const user_id = req.user.id; 

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5." });
        }

        const newRating = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (user_id, store_id) 
             DO UPDATE SET rating = EXCLUDED.rating 
             RETURNING *`,
            [user_id, store_id, rating]
        );

        res.status(200).json({ message: "Rating saved successfully", rating: newRating.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error submitting rating" });
    }
};

module.exports = { getStores, submitRating };