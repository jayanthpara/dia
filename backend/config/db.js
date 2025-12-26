const mongoose = require('mongoose');
const dataMode = require('./dataMode');

let isConnected = false;

const connectDB = async (retries = 3) => {
  if (isConnected) {
    console.log('[MONGO] Already connected');
    return true;
  }

  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('[MONGO] ❌ MONGODB_URI environment variable is not set!');
    console.error('[MONGO] Please set MONGODB_URI in your production environment.');
    dataMode.setMode('JSON');
    return false;
  }

  // Production-ready connection options
  const connectionOptions = {
    serverSelectionTimeoutMS: 30000, // 30 seconds for production
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[MONGO] Connection attempt ${attempt}/${retries}...`);

      await mongoose.connect(process.env.MONGODB_URI, connectionOptions);

      isConnected = true;
      dataMode.setMode('MONGO');

      console.log('[MONGO] ✅ Connected successfully');
      console.log(`[MONGO] Database: ${mongoose.connection.name}`);
      return true;
    } catch (error) {
      console.error(`[MONGO] ❌ Connection attempt ${attempt}/${retries} failed:`, error.message);

      // Detailed error information
      if (error.message.includes('ENOTFOUND')) {
        console.error('[MONGO] DNS resolution failed - check your MongoDB URI hostname');
      } else if (error.message.includes('authentication failed')) {
        console.error('[MONGO] Authentication failed - check username/password');
      } else if (error.message.includes('timeout')) {
        console.error('[MONGO] Connection timeout - check network/firewall settings');
      }

      // Wait before retry (except on last attempt)
      if (attempt < retries) {
        const waitTime = attempt * 2000; // Progressive backoff: 2s, 4s
        console.log(`[MONGO] Retrying in ${waitTime / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retries failed
  console.error('[MONGO] ❌ All connection attempts failed. Falling back to JSON mode.');
  dataMode.setMode('JSON');
  return false;
};

module.exports = connectDB;
