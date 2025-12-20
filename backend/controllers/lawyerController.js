// backend/controllers/lawyerController.js
const Lawyer = require('../models/Lawyer');

// Utility: case-insensitive includes for arrays
function arrayIncludesCI(arr = [], value = '') {
  if (!value) return false;
  return arr.some(item => String(item).toLowerCase() === String(value).toLowerCase());
}

// Support multiple comma-separated values for type/language
function anyMatchCI(arr = [], filterValues = []) {
  const low = filterValues
    .filter(Boolean)
    .map(v => String(v).toLowerCase().trim());
  return arr.some(item => low.includes(String(item).toLowerCase()));
}

async function getLawyers(req, res) {
  try {
    const { type, language, gender, minExperience } = req.query;
    let query = { isActive: true };
    // Filter by case types
    if (type) {
      const types = type.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      if (types.length > 0) {
        query.caseTypes = { $in: types };
      }
    }
    // Filter by languages
    if (language) {
      const languages = language.split(',').map(l => l.trim()).filter(Boolean);
      if (languages.length > 0) {
        query.languages = { $in: languages };
      }
    }
    // Filter by gender
    if (gender) {
      query.gender = gender.toLowerCase();
    }
    // Filter by minimum experience
    if (minExperience) {
      query.yearsExperience = { $gte: parseInt(minExperience) };
    }
    const lawyers = await Lawyer.find(query).select('-password');
    res.json(lawyers);
  } catch (err) {
    console.error('Error reading lawyers from MongoDB', err);
    res.status(500).json({ error: 'Failed to read lawyers' });
  }
}

module.exports = {
  getLawyers,
};
