const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse the connection
  if (isConnected) {
    console.log('✓ Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    // Check if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable not set');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority',
      maxIdleTimeMS: 45000,
      family: 4, // Force IPv4
      autoIndex: false, // Disable auto index creation on every request
    });
    
    isConnected = true;
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠ MongoDB disconnected');
      isConnected = false;
    });
    
    return conn;
  } catch (error) {
    isConnected = false;
    console.log(`⚠ MongoDB not available: ${error.message}`);
    console.log('⚠ Using JSON fallback for lawyer data');
    console.log('⚠ For production, verify:');
    console.log('   1. MONGODB_URI is correctly set');
    console.log('   2. MongoDB Atlas IP whitelist includes 0.0.0.0/0 or Vercel IPs');
    console.log('   3. MongoDB credentials are correct');
    return null;
  }
};

module.exports = connectDB;
