const pool = require('../db');
const bcrypt = require('bcrypt');

const getDashboardStats = async (req, res) => {
    try {
        const usersCount = await pool.query("SELECT COUNT(*) FROM users");
        const storesCount = await pool.query("SELECT COUNT(*) FROM stores");
        const ratingsCount = await pool.query("SELECT COUNT(*) FROM ratings");

        res.json({
            totalUsers: parseInt(usersCount.rows[0].count),
            totalStores: parseInt(storesCount.rows[0].count),
            totalRatings: parseInt(ratingsCount.rows[0].count)
        });
    } catch (err) {
        res.status(500).json({ error: "Server error retrieving dashboard stats" });
    }
};


const addStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;

        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: "Name must be between 20 and 60 characters." });
        }
        if (!address || address.length > 400) {
            return res.status(400).json({ error: "Address cannot exceed 400 characters." });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        const storeExists = await pool.query("SELECT * FROM stores WHERE email = $1", [email]);
        if (storeExists.rows.length > 0) {
            return res.status(400).json({ error: "Store with this email already exists." });
        }

        const newStore = await pool.query(
            "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, address, owner_id]
        );

        res.status(201).json({ message: "Store added successfully", store: newStore.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while adding store" });
    }
};

const getUsers = async (req, res) => {
    try {
        const { search, role, sortBy, order } = req.query;
        let query = "SELECT id, name, email, address, role FROM users WHERE 1=1";
        const values = [];
        let count = 1;

        if (search) {
            query += ` AND (name ILIKE $${count} OR email ILIKE $${count} OR address ILIKE $${count})`;
            values.push(`%${search}%`);
            count++;
        }
        if (role) {
            query += ` AND role = $${count}`;
            values.push(role);
            count++;
        }

        const validColumns = ['name', 'email', 'role'];
        const sortColumn = validColumns.includes(sortBy) ? sortBy : 'id';
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
        
        query += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const users = await pool.query(query, values);
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error retrieving users" });
    }
};

const getStores = async (req, res) => {
    try {
        const { search, sortBy, order } = req.query;
        let query = "SELECT * FROM stores WHERE 1=1";
        const values = [];
        let count = 1;

        if (search) {
            query += ` AND (name ILIKE $${count} OR email ILIKE $${count} OR address ILIKE $${count})`;
            values.push(`%${search}%`);
            count++;
        }

        const validColumns = ['name', 'email'];
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

module.exports = { getDashboardStats, addStore, getUsers, getStores };