const Message = require('../models/Message');
const Chat = require('../models/Chat');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { chatId, receiverId, content } = req.body;
    const senderId = req.user._id;

    if (!content) {
      res.status(400);
      throw new Error('Message content is required');
    }

    const message = await Message.create({
      chatId,
      sender: senderId,
      receiver: receiverId,
      content
    });

    // Update last message in Chat
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages
};
