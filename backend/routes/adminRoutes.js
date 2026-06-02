const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/users', async (req, res) => {
  try {
    
    const usersQuery = await pool.query(
      'SELECT id, name, email, address, role FROM users ORDER BY id ASC'
    );
    res.json(usersQuery.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

router.get('/stores', async (req, res) => {
  try {
    const storesQuery = await pool.query(
      'SELECT * FROM stores ORDER BY id ASC'
    );
    res.json(storesQuery.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error fetching stores' });
  }
});

module.exports = router;