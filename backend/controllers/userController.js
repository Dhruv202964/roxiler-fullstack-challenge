const pool = require('../db');

const getStores = async (req, res) => {
  try {
    const storesQuery = await pool.query(`
      SELECT s.id, s.name, s.address, s.email, 
      COALESCE(ROUND(AVG(r.rating), 1), 0) as average_rating,
      COUNT(r.id) as total_reviews
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY average_rating DESC, s.name ASC
    `);
    res.json(storesQuery.rows);
  } catch (err) {
    console.error("FETCH STORES ERROR:", err.message);
    res.status(500).json({ error: 'Server error fetching stores' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { storeId, rating, reviewText, verifiedVisit } = req.body;
    const userId = req.user.id;
    
    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating, review_text, verified_visit) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (user_id, store_id) 
       DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text, verified_visit = EXCLUDED.verified_visit`,
      [userId, storeId, rating, reviewText, verifiedVisit]
    );
    
    res.json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error("RATING ERROR:", err.message);
    res.status(500).json({ error: 'Server error submitting rating' });
  }
};

module.exports = { getStores, submitRating };