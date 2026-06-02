const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const signup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: "Name must be between 20 and 60 characters." });
        }
        if (!address || address.length > 400) {
            return res.status(400).json({ error: "Address cannot exceed 400 characters." });
        }
        
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must be 8-16 characters, with at least one uppercase letter and one special character." });
        }

        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

    
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
            [name, email, hashedPassword, address, 'normal']
        );

        res.status(201).json({ 
            message: "User registered successfully", 
            user: newUser.rows[0] 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during registration" });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const user = userQuery.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
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
        console.error(err.message);
        res.status(500).json({ error: "Server error during login" });
    }
};

module.exports = { signup, login };