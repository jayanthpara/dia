const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Notification = require('../models/Notification');

// GET /api/notifications (admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const notes = await Notification.find({}).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Failed to read notifications', err);
    res.status(500).json({ error: 'Failed to read notifications' });
  }
});

// PATCH /api/notifications/:id/read (admin)
router.patch('/:id/read', adminAuth, async (req, res) => {
  try {
    const note = await Notification.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Notification not found' });
    note.isRead = true;
    await note.save();
    res.json(note);
  } catch (err) {
    console.error('Failed to update notification', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router;