const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  // Add more fields as needed
});

module.exports = mongoose.model('Notification', NotificationSchema);