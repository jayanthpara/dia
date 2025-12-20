// backend/routes/lawyers.js
const express = require('express');
const router = express.Router();

const { getLawyers } = require('../controllers/lawyerController');

// GET /api/lawyers
router.get('/', getLawyers);

module.exports = router;
