const express = require('express');
const router = express.Router();
const { getOwnerStores, createStore, getStoreReviews } = require('../controllers/ownerController');
const { verifyToken } = require('../middleware/authMiddleware');

const verifyOwner = (req, res, next) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ error: "Access denied, store owners only" });
    }
    next();
};

router.get('/stores', verifyToken, verifyOwner, getOwnerStores);
router.post('/stores', verifyToken, verifyOwner, createStore);
router.get('/stores/:id/reviews', verifyToken, verifyOwner, getStoreReviews);

module.exports = router;