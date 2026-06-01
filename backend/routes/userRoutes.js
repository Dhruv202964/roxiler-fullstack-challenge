const express = require('express');
const router = express.Router();
const { getStores, submitRating } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/stores', verifyToken, getStores);
router.post('/ratings', verifyToken, submitRating);

module.exports = router;