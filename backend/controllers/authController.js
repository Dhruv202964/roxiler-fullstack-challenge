const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const accountRole = role === 'owner' ? 'owner' : 'user';

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email, hashedPassword, address, accountRole]
    );

    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
  } catch (err) {
    console.error("SIGNUP ERROR:", err.message);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'roxiler_secret_key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};

module.exports = { signup, login };