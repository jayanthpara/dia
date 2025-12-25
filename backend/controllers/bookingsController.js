// backend/controllers/bookingsController.js
// Mongo-first bookings controller (Guest booking supported)

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataMode = require('../config/dataMode');
const Booking = require('../models/Booking');
const Lawyer = require('../models/Lawyer');

/* =======================
   JSON HELPERS (FALLBACK)
======================= */
const bookingsPath = path.join(__dirname, '../data/bookings.json');

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8') || '[]');
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* =======================
   CREATE BOOKING (GUEST OK)
======================= */
exports.createBooking = async (req, res) => {
  let {
    lawyerId,
    date,
    time,
    slotId,
    clientName,
    clientEmail
  } = req.body;

  // 🔥 Guest defaults
  clientName = clientName || 'Guest User';
  clientEmail = clientEmail || 'guest@dia.local';

  if (!lawyerId || !date || !time) {
    return res.status(400).json({
      error: 'Missing required booking fields (lawyerId, date, time)'
    });
  }

  try {
    /* ========= MONGO MODE ========= */
    if (dataMode.mode === 'MONGO') {
      const lawyer = await Lawyer.findById(lawyerId);
      if (!lawyer) {
        return res.status(404).json({ error: 'Lawyer not found' });
      }

      const amount = lawyer.consultationFee ?? 0;

      const booking = await Booking.create({
        lawyerId: lawyer._id,
        lawyerName: lawyer.name,
        clientName,
        clientEmail,
        date,
        time,
        slotId: slotId || null,
        amount,
        charged: false
      });

      console.log(
        `[BOOKINGS] CREATED ${booking._id} (MongoDB, Guest=${clientEmail === 'guest@dia.local'})`
      );

      return res.status(201).json(booking);
    }

    /* ========= JSON MODE ========= */
    const bookings = readJson(bookingsPath);
    const id = uuidv4();

    const booking = {
      id,
      lawyerId,
      clientName,
      clientEmail,
      date,
      time,
      slotId: slotId || null,
      amount: 0,
      charged: false,
      createdAt: new Date().toISOString()
    };

    bookings.push(booking);
    writeJson(bookingsPath, bookings);

    console.log(
      `[BOOKINGS] CREATED ${id} (JSON, Guest=${clientEmail === 'guest@dia.local'})`
    );

    res.status(201).json(booking);

  } catch (err) {
    console.error('[BOOKINGS] CREATE ERROR:', err.message);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

/* =======================
   GET BOOKINGS (ADMIN)
======================= */
exports.getBookings = async (req, res) => {
  try {
    if (dataMode.mode === 'MONGO') {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      console.log(`[BOOKINGS] FETCHED ${bookings.length} (MongoDB)`);
      return res.json(bookings);
    }

    const bookings = readJson(bookingsPath);
    console.log(`[BOOKINGS] FETCHED ${bookings.length} (JSON)`);
    res.json(bookings);

  } catch (err) {
    console.error('[BOOKINGS] FETCH ERROR:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

/* =======================
   CHARGE BOOKING
======================= */
exports.chargeBooking = async (req, res) => {
  const { id } = req.params;

  try {
    if (dataMode.mode === 'MONGO') {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      booking.charged = true;
      booking.chargedAt = new Date();
      await booking.save();

      console.log(`[BOOKINGS] CHARGED ${id} (MongoDB)`);

      return res.json(booking);
    }

    const bookings = readJson(bookingsPath);
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    bookings[idx].charged = true;
    bookings[idx].chargedAt = new Date().toISOString();
    writeJson(bookingsPath, bookings);

    console.log(`[BOOKINGS] CHARGED ${id} (JSON)`);

    res.json(bookings[idx]);

  } catch (err) {
    console.error('[BOOKINGS] CHARGE ERROR:', err.message);
    res.status(500).json({ error: 'Failed to charge booking' });
  }
};
