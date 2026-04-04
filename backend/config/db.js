// config/db.js — MongoDB Atlas connection (persistent, no in-memory fallback)
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('<username>')) {
    console.error('❌  MONGO_URI is not set in .env');
    console.error('    Get your connection string from https://cloud.mongodb.com');
    console.error('    and paste it into backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅  MongoDB Atlas connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️   MongoDB disconnected');
});
mongoose.connection.on('reconnected', () => {
  console.log('🔄  MongoDB reconnected');
});

module.exports = connectDB;
