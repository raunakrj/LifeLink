const express = require('express');
const router = express.Router();
const { searchDonors, getDonorById } = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchDonors);
router.get('/matches', protect, searchDonors);
router.get('/:id', protect, getDonorById);

module.exports = router;
