// backend/controllers/appointmentsController.js
// Mongo-first appointments controller (Guest-safe)

const fs = require('fs');
const path = require('path');

const dataMode = require('../config/dataMode');
const Lawyer = require('../models/Lawyer');

/* =======================
   JSON HELPERS
======================= */
const lawyersPath = path.join(__dirname, '../data/lawyers.json');

function readLawyersJSON() {
  if (!fs.existsSync(lawyersPath)) return [];
  return JSON.parse(fs.readFileSync(lawyersPath, 'utf-8') || '[]');
}

/* =======================
   GET APPOINTMENTS
======================= */
exports.getAppointments = async (req, res) => {
  try {
    if (dataMode.mode === 'MONGO') {
      const lawyers = await Lawyer.find({}, {
        name: 1,
        appointments: 1
      }).lean();

      const appointments = [];

      lawyers.forEach(lawyer => {
        (lawyer.appointments || []).forEach(slot => {
          appointments.push({
            slotId: slot.id,
            lawyerId: lawyer._id,
            lawyerName: lawyer.name,
            date: slot.date,
            time: slot.time,
            status: slot.status || 'available',
            bookedBy: slot.bookedBy || null
          });
        });
      });

      console.log(
        `[APPOINTMENTS] FETCHED ${appointments.length} slots (MongoDB)`
      );

      return res.json(appointments);
    }

    const lawyers = readLawyersJSON();
    const appointments = [];

    lawyers.forEach(l => {
      (l.appointments || []).forEach(a => {
        appointments.push({
          slotId: a.id,
          lawyerId: l.id,
          lawyerName: l.name,
          date: a.date,
          time: a.time,
          status: a.status || 'available',
          bookedBy: a.bookedBy || null
        });
      });
    });

    console.log(
      `[APPOINTMENTS] FETCHED ${appointments.length} slots (JSON)`
    );

    res.json(appointments);

  } catch (err) {
    console.error('[APPOINTMENTS] FETCH ERROR:', err.message);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};
