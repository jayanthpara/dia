const Lawyer = require('../models/Lawyer');

async function getAppointments(req, res) {
  try {
    const lawyers = await Lawyer.find({});
    // Flatten appointments with lawyer meta
    const appointments = [];
    lawyers.forEach(l => {
      const appts = l.appointments || [];
      appts.forEach(a => {
        appointments.push({
          slotId: a.id,
          lawyerId: l._id,
          lawyerName: l.name,
          date: a.date,
          time: a.time,
          status: a.status || 'available',
          bookedBy: a.bookedBy || null,
        });
      });
    });
    res.json(appointments);
  } catch (err) {
    console.error('getAppointments error', err);
    res.status(500).json({ error: 'Failed to read appointments' });
  }
}

module.exports = {
  getAppointments,
};