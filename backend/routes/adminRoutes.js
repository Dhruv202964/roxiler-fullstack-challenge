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
    res.status(500).json({ error: 'Server error fetching stores' });
  }
});

router.get('/ratings/count', async (req, res) => {
  try {
    const countQuery = await pool.query('SELECT COUNT(*) FROM ratings');
    res.json({ total: parseInt(countQuery.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching ratings count' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting user' });
  }
});

router.delete('/stores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM stores WHERE id = $1', [id]);
    res.json({ message: 'Store deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting store' });
  }
});

module.exports = router;