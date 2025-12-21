const mongoose = require('mongoose');

const ensureMongoDBConnected = async (req, res, next) => {
  try {
    // If already connected, proceed
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    // Try to connect
    const connectDB = require('../config/db');
    await connectDB();
    
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Continue anyway - will use JSON fallback
    next();
  }
};

module.exports = ensureMongoDBConnected;
