const express = require('express');
const router = express.Router();
const { getDashboardStats, addStore, getUsers, getStores } = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, verifyAdmin, getDashboardStats);
router.post('/stores', verifyToken, verifyAdmin, addStore);
router.get('/users', verifyToken, verifyAdmin, getUsers);
router.get('/stores', verifyToken, verifyAdmin, getStores);

module.exports = router;