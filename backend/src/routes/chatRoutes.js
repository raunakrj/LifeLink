const express = require('express');
const router = express.Router();
const { createChat, getChats } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getChats);
router.post('/create', protect, createChat);

module.exports = router;
