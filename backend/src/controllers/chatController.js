const Chat = require('../models/Chat');
const Message = require('../models/Message');

// @desc    Create or get a chat between two users
// @route   POST /api/chats/create
// @access  Private
const createChat = async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      res.status(400);
      throw new Error('Receiver ID is required');
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId]
      });
    }

    res.status(201).json(chat);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
    .populate('participants', 'name email photoUrl role')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChat,
  getChats
};
