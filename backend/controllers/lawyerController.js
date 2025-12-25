// backend/controllers/lawyerController.js

const fs = require('fs').promises;
const path = require('path');

const dataMode = require('../config/dataMode');
const Lawyer = require('../models/Lawyer');

/* =======================
   UTILITY FUNCTIONS
======================= */

// Case-insensitive exact match for arrays
function anyMatchCI(arr = [], filterValues = []) {
  const normalized = filterValues
    .filter(Boolean)
    .map(v => String(v).toLowerCase().trim());

  return arr.some(item =>
    normalized.includes(String(item).toLowerCase())
  );
}

/* =======================
   CONTROLLER
======================= */

async function getLawyers(req, res) {
  const { type, language, gender, minExperience } = req.query;

  // Normalize multi-value filters
  const types = type ? type.split(',').map(v => v.trim()).filter(Boolean) : null;
  const languages = language ? language.split(',').map(v => v.trim()).filter(Boolean) : null;

  try {
    /* =======================
       MONGO MODE
    ======================= */
    if (dataMode.mode === 'MONGO') {
      let query = {};

      if (gender) {
        query.gender = new RegExp(`^${gender}$`, 'i');
      }

      if (minExperience) {
        const min = parseInt(minExperience, 10);
        if (!Number.isNaN(min)) {
          query.yearsExperience = { $gte: min };
        }
      }

      let lawyers = await Lawyer.find(query).lean();

      // Apply array-based filters in-memory
      if (types && types.length > 0) {
        lawyers = lawyers.filter(l =>
          anyMatchCI(l.caseTypes || [], types)
        );
      }

      if (languages && languages.length > 0) {
        lawyers = lawyers.filter(l =>
          anyMatchCI(l.languages || [], languages)
        );
      }

      console.log(
        `[LAWYERS] FETCHED ${lawyers.length} records from MongoDB`
      );

      return res.json(lawyers);
    }

    /* =======================
       JSON FALLBACK MODE
    ======================= */
    const dataPath = path.join(__dirname, '../data/lawyers.json');
    const raw = await fs.readFile(dataPath, 'utf-8');
    let lawyers = JSON.parse(raw || '[]');

    lawyers = lawyers.filter(lawyer => {
      if (types && types.length > 0) {
        if (!anyMatchCI(lawyer.caseTypes || [], types)) return false;
      }

      if (languages && languages.length > 0) {
        if (!anyMatchCI(lawyer.languages || [], languages)) return false;
      }

      if (gender) {
        if (
          !lawyer.gender ||
          lawyer.gender.toLowerCase() !== String(gender).toLowerCase()
        ) return false;
      }

      if (minExperience) {
        const min = parseInt(minExperience, 10);
        if (Number.isNaN(min)) return false;
        if (!lawyer.yearsExperience || lawyer.yearsExperience < min) return false;
      }

      return true;
    });

    console.log(
      `[LAWYERS] FETCHED ${lawyers.length} records from JSON fallback`
    );

    res.json(lawyers);

  } catch (err) {
    console.error('[LAWYERS] ERROR:', err.message);
    res.status(500).json({ error: 'Failed to fetch lawyers' });
  }
}

module.exports = {
  getLawyers
};
