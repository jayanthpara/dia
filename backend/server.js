// backend/server.js
// Express server with MongoDB for lawyer management

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// CORS Configuration for Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  /\.vercel\.app$/,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log('REQ', req.method, req.originalUrl);
  next();
});

// Routes
const lawyersRouter = require('./routes/lawyers');
const bookingsRouter = require('./routes/bookings');
const notificationsRouter = require('./routes/notifications');
const adminRouter = require('./routes/admin');
const appointmentsRouter = require('./routes/appointments');
const lawyerAuthRouter = require('./routes/lawyerAuth');

app.use('/api/lawyers', lawyersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/lawyer-auth', lawyerAuthRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Lawyer recommendation API - GET /api/lawyer-auth/all for registered lawyers' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Try to connect to MongoDB in background (non-blocking)
  connectDB().catch(err => console.log('MongoDB connection skipped'));
});

// Handle unhandled errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - let server keep running
});
