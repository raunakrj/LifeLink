const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../services/chatbotService');

// @desc    Get AI Chat Response (REST)
// @route   POST /api/chat
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      res.status(400);
      throw new Error('Message is required');
    }

    const aiResponse = await getChatResponse(message, history || []);
    res.json({ response: aiResponse });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
