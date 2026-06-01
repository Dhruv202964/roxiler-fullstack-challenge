const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const { verifyToken } = require('../middleware/authMiddleware');

const verifyOwner = (req, res, next) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ error: "Access denied, store owners only" });
    }
    next();
};

router.get('/dashboard', verifyToken, verifyOwner, getOwnerDashboard);

module.exports = router;