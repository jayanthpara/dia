// backend/routes/admin.js
// Mongo-first admin routes with strict JSON fallback

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const adminAuth = require('../middleware/adminAuth');
const dataMode = require('../config/dataMode');
const Lawyer = require('../models/Lawyer');

/* =======================
   JSON HELPERS (FALLBACK)
======================= */
const lawyersPath = path.join(__dirname, '../data/lawyers.json');

function readLawyersJSON() {
  if (!fs.existsSync(lawyersPath)) return [];
  return JSON.parse(fs.readFileSync(lawyersPath, 'utf-8') || '[]');
}

/* =======================
   ADMIN LOGIN
======================= */
router.post('/login', (req, res) => {
  const provided = req.body?.password;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // Open mode (dev only)
  if (!provided) {
    console.log('[ADMIN] Open login (no password)');
    return res.json({ ok: true, open: true });
  }

  if (provided === adminPassword) {
    console.log('[ADMIN] Login success');
    return res.json({ ok: true });
  }

  console.log('[ADMIN] Login failed');
  res.status(401).json({ ok: false, error: 'Invalid admin password' });
});

/* =======================
   ADMIN SESSION CHECK
======================= */
router.get('/me', adminAuth, (req, res) => {
  res.json({ ok: true });
});

/* =======================
   GET ALL CREDENTIALS
======================= */
router.get('/credentials', adminAuth, async (req, res) => {
  try {
    /* ========= MONGO MODE ========= */
    if (dataMode.mode === 'MONGO') {
      const lawyers = await Lawyer.find({})
        .select('-password')
        .lean();

      console.log(
        `[ADMIN] FETCHED ${lawyers.length} credentials (MongoDB)`
      );

      return res.json({
        success: true,
        count: lawyers.length,
        credentials: lawyers
      });
    }

    /* ========= JSON MODE ========= */
    const lawyers = readLawyersJSON().map(l => {
      const copy = { ...l };
      delete copy.password;
      return copy;
    });

    console.log(
      `[ADMIN] FETCHED ${lawyers.length} credentials (JSON)`
    );

    res.json({
      success: true,
      count: lawyers.length,
      credentials: lawyers
    });

  } catch (error) {
    console.error('[ADMIN] FETCH ERROR:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch credentials'
    });
  }
});

/* =======================
   SEARCH CREDENTIALS
======================= */
router.get('/credentials/search', adminAuth, async (req, res) => {
  const { query } = req.query;

  try {
    /* ========= MONGO MODE ========= */
    if (dataMode.mode === 'MONGO') {
      const mongoQuery = query
        ? {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
        : {};

      const lawyers = await Lawyer.find(mongoQuery)
        .select('-password')
        .lean();

      console.log(
        `[ADMIN] SEARCH "${query}" → ${lawyers.length} results (MongoDB)`
      );

      return res.json({
        success: true,
        count: lawyers.length,
        credentials: lawyers
      });
    }

    /* ========= JSON MODE ========= */
    let lawyers = readLawyersJSON();

    if (query) {
      const q = query.toLowerCase();
      lawyers = lawyers.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.contact?.email?.toLowerCase().includes(q)
      );
    }

    lawyers = lawyers.map(l => {
      const copy = { ...l };
      delete copy.password;
      return copy;
    });

    console.log(
      `[ADMIN] SEARCH "${query}" → ${lawyers.length} results (JSON)`
    );

    res.json({
      success: true,
      count: lawyers.length,
      credentials: lawyers
    });

  } catch (error) {
    console.error('[ADMIN] SEARCH ERROR:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to search credentials'
    });
  }
});

module.exports = router;
