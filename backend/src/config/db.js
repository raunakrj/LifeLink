const mongoose = require('mongoose');
const { createClient } = require('redis');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`[DATABASE] MongoDB Connected to: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DATABASE] Connection Error: ${error.message}`);
    // In production, we might want to retry rather than exit
    if (process.env.NODE_ENV === 'production') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

const redisClient = process.env.REDIS_URL 
  ? createClient({ url: process.env.REDIS_URL })
  : null;

if (redisClient) {
  redisClient.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
       // Silently log that Redis is unavailable instead of a full error
    } else {
       console.log('Redis Client Error', err.message);
    }
  });
}

const connectRedis = async () => {
  if (!redisClient) {
    console.log('Redis URL not found, skipping Redis connection (Socket.io will use in-memory adapter).');
    return;
  }
  try {
    await redisClient.connect();
    console.log('Redis Connected...');
  } catch (error) {
    console.error(`Redis Error: ${error.message}`);
    console.log('Proceeding without Redis...');
  }
};

module.exports = { connectDB, redisClient, connectRedis };
