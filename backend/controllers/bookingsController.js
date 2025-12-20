const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Lawyer = require('../models/Lawyer');

// POST /api/bookings
async function createBooking(req, res) {
  try {
    const { lawyerId, clientName, clientEmail, date, time, slotId } = req.body;
    if (!lawyerId || !clientName || !clientEmail || !date || !time) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }
    // Find lawyer by _id
    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    let usedSlotId = slotId || null;

    // If slotId provided, attempt to mark the slot as booked
    if (usedSlotId && Array.isArray(lawyer.appointments)) {
      const slot = lawyer.appointments.find(s => String(s.id) === String(usedSlotId));
      if (!slot) return res.status(404).json({ error: 'Slot not found' });
      if (slot.status && slot.status !== 'available') {
        return res.status(400).json({ error: 'Slot already booked' });
      }
      slot.status = 'booked';
      slot.bookedAt = new Date().toISOString();
      slot.bookedBy = { clientName, clientEmail };
      await lawyer.save();
    } else if (Array.isArray(lawyer.appointments)) {
      // Try to find a matching available slot for given date/time and auto-assign it
      const matching = lawyer.appointments.find(s => s.date === date && s.time === time && (!s.status || s.status === 'available'));
      if (matching) {
        matching.status = 'booked';
        matching.bookedAt = new Date().toISOString();
        matching.bookedBy = { clientName, clientEmail };
        usedSlotId = matching.id;
        await lawyer.save();
      }
    }

    const amount = lawyer.consultationFee ?? 50;
    const booking = new Booking({
      userId: clientEmail, // or userId if available
      lawyerId: lawyer._id,
      date,
      time,
      status: 'pending',
      createdAt: new Date(),
      clientName,
      clientEmail,
      slotId: usedSlotId,
      amount,
      charged: false,
    });
    await booking.save();

    // Create a notification for admin
    const note = new Notification({
      userId: 'admin',
      message: `New booking for ${lawyer.name}: ${clientName} on ${date} ${time}`,
      type: 'booking',
      isRead: false,
      createdAt: new Date(),
    });
    await note.save();

    res.status(201).json(booking);
  } catch (err) {
    console.error('createBooking error', err);
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
}

// GET /api/bookings (admin)
async function getBookings(req, res) {
  try {
    const bookings = await Booking.find({});
    res.json(bookings);
  } catch (err) {
    console.error('getBookings error', err);
    res.status(500).json({ error: 'Failed to read bookings' });
  }
}

// PATCH /api/bookings/:id/charge (admin)
async function chargeBooking(req, res) {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.charged = true;
    booking.chargedAt = new Date();
    await booking.save();
    // Add notification
    const note = new Notification({
      userId: 'admin',
      message: `Booking ${id} marked as charged`,
      type: 'booking',
      isRead: false,
      createdAt: new Date(),
    });
    await note.save();
    res.json(booking);
  } catch (err) {
    console.error('chargeBooking error', err);
    res.status(500).json({ error: 'Failed to charge booking' });
  }
}

module.exports = {
  createBooking,
  getBookings,
  chargeBooking,
};
