// backend/routes/notifications.js
// Mongo-first notifications route with safe JSON fallback

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataMode = require('../config/dataMode');

/* =======================
   JSON HELPERS (FALLBACK)
======================= */
const notificationsPath = path.join(__dirname, '../data/notifications.json');

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8') || '[]');
  } catch {
    return [];
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* =======================
   GET NOTIFICATIONS
======================= */
router.get('/', async (req, res) => {
  try {
    /* ========= MONGO MODE ========= */
    if (dataMode.mode === 'MONGO') {
      let Notification;
      try {
        Notification = require('../models/Notification');
      } catch (err) {
        console.warn('[NOTIFICATIONS] Mongo model missing, using JSON fallback');
        throw new Error('MONGO_MODEL_MISSING');
      }

      const notifications = await Notification.find().sort({ createdAt: -1 });
      return res.json(notifications);
    }

    /* ========= JSON FALLBACK ========= */
    const notifications = readJson(notificationsPath);
    res.json(notifications);

  } catch (err) {
    console.error('[NOTIFICATIONS] FETCH ERROR', err.message);

    // Fallback ONLY if Mongo fails
    const notifications = readJson(notificationsPath);
    res.json(notifications);
  }
});

/* =======================
   CREATE NOTIFICATION
======================= */
router.post('/', async (req, res) => {
  const { type, message } = req.body;

  if (!type || !message) {
    return res.status(400).json({ error: 'Type and message are required' });
  }

  try {
    /* ========= MONGO MODE ========= */
    if (dataMode.mode === 'MONGO') {
      let Notification;
      try {
        Notification = require('../models/Notification');
      } catch {
        throw new Error('MONGO_MODEL_MISSING');
      }

      const notification = await Notification.create({
        type,
        message,
        read: false
      });

      return res.status(201).json(notification);
    }

    /* ========= JSON FALLBACK ========= */
    const notifications = readJson(notificationsPath);

    const notification = {
      id: Date.now().toString(),
      type,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };

    notifications.push(notification);
    writeJson(notificationsPath, notifications);

    res.status(201).json(notification);

  } catch (err) {
    console.error('[NOTIFICATIONS] CREATE ERROR', err.message);

    // Final fallback
    const notifications = readJson(notificationsPath);
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };

    notifications.push(notification);
    writeJson(notificationsPath, notifications);

    res.status(201).json(notification);
  }
});

/* =======================
   MARK AS READ
======================= */
router.patch('/:id/read', async (req, res) => {
  const { id } = req.params;

  try {
    /* ========= MONGO MODE ========= */
    if (dataMode.mode === 'MONGO') {
      let Notification;
      try {
        Notification = require('../models/Notification');
      } catch {
        throw new Error('MONGO_MODEL_MISSING');
      }

      const notification = await Notification.findByIdAndUpdate(
        id,
        { read: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      return res.json(notification);
    }

    /* ========= JSON FALLBACK ========= */
    const notifications = readJson(notificationsPath);
    const idx = notifications.findIndex(n => n.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notifications[idx].read = true;
    writeJson(notificationsPath, notifications);

    res.json(notifications[idx]);

  } catch (err) {
    console.error('[NOTIFICATIONS] READ ERROR', err.message);

    const notifications = readJson(notificationsPath);
    const idx = notifications.findIndex(n => n.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notifications[idx].read = true;
    writeJson(notificationsPath, notifications);

    res.json(notifications[idx]);
  }
});

module.exports = router;
