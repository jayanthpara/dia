const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { getAppointments } = require('../controllers/appointmentsController');

// GET /api/appointments (admin)
router.get('/', adminAuth, getAppointments);

module.exports = router;