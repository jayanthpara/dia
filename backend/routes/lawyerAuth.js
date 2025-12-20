const express = require('express');
const router = express.Router();
const { registerLawyer, loginLawyer, getAllRegisteredLawyers } = require('../controllers/lawyerAuthController');

// POST /api/lawyer-auth/register
router.post('/register', registerLawyer);

// POST /api/lawyer-auth/login
router.post('/login', loginLawyer);

// GET /api/lawyer-auth/all - Get all registered lawyers (for public listing)
router.get('/all', getAllRegisteredLawyers);

module.exports = router;
