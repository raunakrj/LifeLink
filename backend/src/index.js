require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB, connectRedis } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { handleChatStream } = require('./services/chatbotService');

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []),
  'http://localhost:3000',
  'http://localhost:5173'
].map(origin => origin.trim().replace(/\/$/, '')).filter(Boolean);


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect Databases
connectDB();
connectRedis();

// Socket.io injection
app.set('io', io);

// AI Status check
const aiKey = process.env.ANTHROPIC_API_KEY;
if (!aiKey || aiKey === 'your_anthropic_api_key_here') {
  console.log('[STARTUP] ⚠️  ANTHROPIC_API_KEY is not configured. AI features will use fallback mode.');
} else {
  console.log('[STARTUP] ✅ ANTHROPIC_API_KEY found. Checking connectivity...');
  const Anthropic = require('@anthropic-ai/sdk');
  const testClient = new Anthropic({ apiKey: aiKey });
  testClient.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1,
    messages: [{ role: "user", content: "hi" }],
  }).then(() => {
    console.log('[STARTUP] ✅ AI Service is online and responsive.');
  }).catch((err) => {
    console.error('[STARTUP] ❌ AI Service connectivity failed:', err.message);
    console.log('[STARTUP] AI features will operate in fallback mode.');
  });
}

const { protect } = require('./middleware/authMiddleware');
const { updateUserProfile } = require('./controllers/userController');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// Spec-specific profile endpoint
app.put('/api/profile', protect, updateUserProfile);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // AI Chatbot Event
  socket.on('chat-message', ({ message, history }) => {
    handleChatStream(socket, message, history);
  });

  // Real-time Messaging Events
  socket.on('join-chat', (chatId) => {
    console.log(`[SOCKET] User ${socket.id} joined chat: ${chatId}`);
    socket.join(chatId);
  });

  socket.on('send-message', (data) => {
    const { chatId, message } = data;
    console.log(`[SOCKET] Message in ${chatId} from ${socket.id}`);
    // Broadcast to others in the room
    socket.to(chatId).emit('receive-message', message);
    
    // Also notify receiver if they are in their own private notification room
    if (message.receiver) {
        io.to(message.receiver).emit('new-notification', {
            type: 'message',
            senderName: message.senderName || 'Someone',
            text: message.content,
            chatId
        });
    }
  });

  socket.on('typing', ({ chatId, userName }) => {
    socket.to(chatId).emit('user-typing', { userName });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('LifeLink API is running...');
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[SERVER] LifeLink Backend running on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[CORS] Enabled for: ${allowedOrigins.join(', ')}`);
});
