const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const bookingsPath = path.join(__dirname, '../data/bookings.json');
const lawyersPath = path.join(__dirname, '../data/lawyers.json');
const notificationsPath = path.join(__dirname, '../data/notifications.json');
const transactionsCsvPath = path.join(__dirname, '../data/transactions.csv');

async function ensureFiles() {
  // Ensure files exist and are initialized
  try {
    await fs.access(bookingsPath);
  } catch (err) {
    await fs.writeFile(bookingsPath, '[]');
  }
  try {
    await fs.access(notificationsPath);
  } catch (err) {
    await fs.writeFile(notificationsPath, '[]');
  }
  try {
    await fs.access(transactionsCsvPath);
  } catch (err) {
    // write header
    await fs.writeFile(transactionsCsvPath, 'id,bookingId,lawyerId,lawyerName,clientName,clientEmail,date,time,amount,charged,createdAt,chargedAt\n');
  }
}

async function readJson(file) {
  const raw = await fs.readFile(file, 'utf-8');
  return JSON.parse(raw || '[]');
}

async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function appendTransactionCsv(row) {
  const line = `${row.id},${row.bookingId},${row.lawyerId},"${(row.lawyerName || '').replace(/"/g, '""')}","${(row.clientName || '').replace(/"/g, '""')}",${row.clientEmail || ''},${row.date || ''},${row.time || ''},${row.amount || 0},${row.charged || false},${row.createdAt || ''},${row.chargedAt || ''}\n`;
  await fs.appendFile(transactionsCsvPath, line);
}

// POST /api/bookings
async function createBooking(req, res) {
  try {
    await ensureFiles();
    const { lawyerId, clientName, clientEmail, date, time, slotId } = req.body;
    console.log('createBooking request', { lawyerId, clientName, clientEmail, date, time, slotId });

    if (!lawyerId || !clientName || !clientEmail || !date || !time) {
      console.warn('createBooking missing fields', req.body);
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const lawyers = await readJson(lawyersPath);
    const lawyer = lawyers.find(l => String(l.id) === String(lawyerId));
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });

    let usedSlotId = slotId || null;

    // If slotId provided, attempt to mark the slot as booked
    if (usedSlotId) {
      const slot = (lawyer.appointments || []).find(s => String(s.id) === String(usedSlotId));
      if (!slot) return res.status(404).json({ error: 'Slot not found' });
      if (slot.status && slot.status !== 'available') {
        return res.status(400).json({ error: 'Slot already booked' });
      }
      // Mark booked and attach meta
      slot.status = 'booked';
      slot.bookedAt = new Date().toISOString();
      slot.bookedBy = { clientName, clientEmail };
      // Persist lawyers data with slot updated
      await writeJson(lawyersPath, lawyers);
    } else {
      // Try to find a matching available slot for given date/time and auto-assign it
      const matching = (lawyer.appointments || []).find(s => s.date === date && s.time === time && (!s.status || s.status === 'available'));
      if (matching) {
        matching.status = 'booked';
        matching.bookedAt = new Date().toISOString();
        matching.bookedBy = { clientName, clientEmail };
        usedSlotId = matching.id;
        await writeJson(lawyersPath, lawyers);
        console.log('Auto-assigned slot', matching.id);
      }
    }

    const bookings = await readJson(bookingsPath);
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const amount = lawyer.consultationFee ?? 50; // default fee if not present

    const booking = {
      id,
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      clientName,
      clientEmail,
      date,
      time,
      slotId: usedSlotId,
      amount,
      charged: false,
      createdAt,
    };

    bookings.push(booking);
    await writeJson(bookingsPath, bookings);

    // Append to CSV transactions sheet
    await appendTransactionCsv({ id: uuidv4(), bookingId: id, lawyerId: lawyer.id, lawyerName: lawyer.name, clientName, clientEmail, date, time, amount, charged: false, createdAt, chargedAt: '' });

    // Create a notification for admin
    const notifications = await readJson(notificationsPath);
    const note = {
      id: uuidv4(),
      bookingId: id,
      message: `New booking for ${lawyer.name}: ${clientName} on ${date} ${time}`,
      read: false,
      createdAt,
    };
    notifications.unshift(note);
    await writeJson(notificationsPath, notifications);

    console.log('Booking created', booking.id);
    // Return booking created
    res.status(201).json(booking);
  } catch (err) {
    console.error('createBooking error', err);
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
}

// GET /api/bookings (admin)
async function getBookings(req, res) {
  try {
    await ensureFiles();
    const bookings = await readJson(bookingsPath);
    res.json(bookings);
  } catch (err) {
    console.error('getBookings error', err);
    res.status(500).json({ error: 'Failed to read bookings' });
  }
}

// PATCH /api/bookings/:id/charge (admin)
async function chargeBooking(req, res) {
  try {
    await ensureFiles();
    const { id } = req.params;
    const bookings = await readJson(bookingsPath);
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Booking not found' });

    bookings[idx].charged = true;
    bookings[idx].chargedAt = new Date().toISOString();

    await writeJson(bookingsPath, bookings);

    // Append a transaction record indicating charged
    await appendTransactionCsv({ id: uuidv4(), bookingId: id, lawyerId: bookings[idx].lawyerId, lawyerName: bookings[idx].lawyerName, clientName: bookings[idx].clientName, clientEmail: bookings[idx].clientEmail, date: bookings[idx].date, time: bookings[idx].time, amount: bookings[idx].amount, charged: true, createdAt: bookings[idx].createdAt, chargedAt: bookings[idx].chargedAt });

    // Add notification
    const notifications = await readJson(notificationsPath);
    const note = {
      id: uuidv4(),
      bookingId: id,
      message: `Booking ${id} for ${bookings[idx].lawyerName} marked as charged`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(note);
    await writeJson(notificationsPath, notifications);

    res.json(bookings[idx]);
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
