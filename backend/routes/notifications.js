const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const adminAuth = require('../middleware/adminAuth');

const notificationsPath = path.join(__dirname, '../data/notifications.json');

async function readJson(file) {
  const raw = await fs.readFile(file, 'utf-8');
  return JSON.parse(raw || '[]');
}
async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// GET /api/notifications (admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    await fs.access(notificationsPath).catch(() => fs.writeFile(notificationsPath, '[]'));
    const notes = await readJson(notificationsPath);
    res.json(notes);
  } catch (err) {
    console.error('Failed to read notifications', err);
    res.status(500).json({ error: 'Failed to read notifications' });
  }
});

// PATCH /api/notifications/:id/read (admin)
router.patch('/:id/read', adminAuth, async (req, res) => {
  try {
    await fs.access(notificationsPath).catch(() => fs.writeFile(notificationsPath, '[]'));
    const notes = await readJson(notificationsPath);
    const idx = notes.findIndex(n => n.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Notification not found' });
    notes[idx].read = true;
    await writeJson(notificationsPath, notes);
    res.json(notes[idx]);
  } catch (err) {
    console.error('Failed to update notification', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router;