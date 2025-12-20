const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dia-lawyers', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`⚠ MongoDB not available: ${error.message}`);
    console.log('⚠ Using JSON fallback for lawyer data');
    return null;
  }
};

module.exports = connectDB;
