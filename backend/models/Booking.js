const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  lawyerId: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  // Add more fields as needed
});

module.exports = mongoose.model('Booking', BookingSchema);