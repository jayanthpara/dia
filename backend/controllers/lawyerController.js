// backend/controllers/lawyerController.js
const fs = require('fs').promises;
const path = require('path');

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
    const dataPath = path.join(__dirname, '../data/lawyers.json');
    const raw = await fs.readFile(dataPath, 'utf-8');
    const lawyers = JSON.parse(raw || '[]');

    // Query params
    const { type, language, gender, minExperience } = req.query;

    // Normalize multi-valued params (comma-separated)
    const types = type ? type.split(',').map(s => s.trim()).filter(Boolean) : null;
    const languages = language ? language.split(',').map(s => s.trim()).filter(Boolean) : null;

    const filtered = lawyers.filter(lawyer => {
      // Filter by type (case-insensitive, supports multiple)
      if (types && types.length > 0) {
        if (!anyMatchCI(lawyer.caseTypes || [], types)) return false;
      }

      // Filter by language
      if (languages && languages.length > 0) {
        if (!anyMatchCI(lawyer.languages || [], languages)) return false;
      }

      // Filter by gender (single value)
      if (gender) {
        if (!lawyer.gender || lawyer.gender.toLowerCase() !== String(gender).toLowerCase()) return false;
      }

      // Filter by minExperience (number)
      if (minExperience) {
        const min = parseInt(minExperience, 10);
        if (Number.isNaN(min)) return false; // invalid number, exclude
        if (!lawyer.yearsExperience || lawyer.yearsExperience < min) return false;
      }

      return true;
    });

    res.json(filtered);
  } catch (err) {
    console.error('Error reading lawyers.json', err);
    res.status(500).json({ error: 'Failed to read lawyers data' });
  }
}

module.exports = {
  getLawyers,
};
