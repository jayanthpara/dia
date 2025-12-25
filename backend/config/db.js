const mongoose = require('mongoose');
const dataMode = require('./dataMode');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('[MONGO] Already connected');
    return true;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });

    isConnected = true;
    dataMode.setMode('MONGO');

    console.log('[MONGO] Connected successfully');
    return true;
  } catch (error) {
    console.error('[MONGO] Connection failed:', error.message);
    dataMode.setMode('JSON');
    return false;
  }
};

module.exports = connectDB;
