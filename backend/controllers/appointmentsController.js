const fs = require('fs').promises;
const path = require('path');

const lawyersPath = path.join(__dirname, '../data/lawyers.json');

async function getAppointments(req, res) {
  try {
    const raw = await fs.readFile(lawyersPath, 'utf-8');
    const lawyers = JSON.parse(raw || '[]');

    // Flatten appointments with lawyer meta
    const appointments = [];
    lawyers.forEach(l => {
      const appts = l.appointments || [];
      appts.forEach(a => {
        appointments.push({
          slotId: a.id,
          lawyerId: l.id,
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