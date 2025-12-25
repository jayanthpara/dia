// backend/server.js
// Express server with MongoDB-first data strategy (JSON fallback only if Mongo fails)

// =======================
// LOAD ENV (MUST BE FIRST)
// =======================
require('dotenv').config();

console.log('ENV CHECK:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'LOADED' : 'MISSING',
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
});

// =======================
// IMPORTS
// =======================
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const dataMode = require('./config/dataMode');

// =======================
// APP INIT
// =======================
const app = express();

// =======================
// CORS CONFIG
// =======================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  /\.vercel\.app$/,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    const allowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );

    if (allowed) return callback(null, true);

    console.log('❌ Blocked by CORS:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// =======================
// ROUTES
// =======================
app.use('/api/lawyers', require('./routes/lawyers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/lawyer-auth', require('./routes/lawyerAuth'));

// =======================
// ROOT & HEALTH
// =======================
app.get('/', (req, res) => {
  res.json({
    message: 'Lawyer recommendation API is running',
    dataMode: dataMode.mode,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'healthy',
    dataMode: dataMode.mode,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// =======================
// SERVER START (ONLY ONCE)
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    const mongoAvailable = await connectDB();

    if (mongoAvailable) {
      dataMode.setMode('MONGO');
      console.log('[SYSTEM] MongoDB ACTIVE → All data from MongoDB');
    } else {
      dataMode.setMode('JSON');
      console.log('[SYSTEM] MongoDB DOWN → Using JSON fallback');
    }
  } catch (err) {
    dataMode.setMode('JSON');
    console.error('[SYSTEM] MongoDB init failed → JSON fallback:', err.message);
  }
});

// =======================
// PROCESS SAFETY
// =======================
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
