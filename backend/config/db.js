const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable not set');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.log(`⚠ MongoDB not available: ${error.message}`);
    console.log('⚠ Using JSON fallback for lawyer data');
    console.log('⚠ For production, set MONGODB_URI environment variable');
    return null;
  }
};

module.exports = connectDB;
