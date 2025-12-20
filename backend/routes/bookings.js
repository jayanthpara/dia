const express = require('express');
const router = express.Router();
const { createBooking, getBookings, chargeBooking } = require('../controllers/bookingsController');
const adminAuth = require('../middleware/adminAuth');

// Public: create booking
router.post('/', createBooking);

// Admin-only: list bookings
router.get('/', adminAuth, getBookings);

// Admin-only: mark charged
router.patch('/:id/charge', adminAuth, chargeBooking);

module.exports = router;
