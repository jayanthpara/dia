// backend/controllers/lawyerAuthController.js
// Mongo-first auth controller with strict JSON fallback

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const Lawyer = require('../models/Lawyer');
const dataMode = require('../config/dataMode');

/* =======================
   HELPERS (JSON MODE)
======================= */
const lawyersJsonPath = path.join(__dirname, '../data/lawyers.json');

function readLawyersJSON() {
  return JSON.parse(fs.readFileSync(lawyersJsonPath, 'utf-8') || '[]');
}

function writeLawyersJSON(data) {
  fs.writeFileSync(lawyersJsonPath, JSON.stringify(data, null, 2));
}

/* =======================
   REGISTER LAWYER
======================= */
exports.registerLawyer = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    caseTypes = [],
    languages = [],
    gender = 'other',
    yearsExperience = 0,
    location = '',
    isProBono = false,
    bio = ''
  } = req.body;

  if (!email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and phone are required'
    });
  }

  try {
    /* ========= MONGO MODE ========= */
    if (dataMode.mode === 'MONGO') {
      const existing = await Lawyer.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      const lawyer = await Lawyer.create({
        name,
        email: email.toLowerCase(),
        password,
        phone,
        caseTypes,
        languages,
        gender,
        yearsExperience,
        location,
        isProBono,
        bio,
        isActive: true,
        registeredAt: new Date()
      });

      const obj = lawyer.toObject();
      delete obj.password;

      console.log(`[AUTH] REGISTER ${email} (MongoDB)`);

      return res.status(201).json({
        success: true,
        message: 'Lawyer registered successfully',
        lawyer: obj
      });
    }

    /* ========= JSON MODE ========= */
    const lawyers = readLawyersJSON();

    if (lawyers.some(l => l.email === email.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newLawyer = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone,
      caseTypes,
      languages,
      gender,
      yearsExperience,
      location,
      isProBono,
      bio,
      isActive: true,
      registeredAt: new Date().toISOString()
    };

    lawyers.push(newLawyer);
    writeLawyersJSON(lawyers);

    const copy = { ...newLawyer };
    delete copy.password;

    console.log(`[AUTH] REGISTER ${email} (JSON)`);

    res.status(201).json({
      success: true,
      message: 'Lawyer registered successfully',
      lawyer: copy
    });

  } catch (err) {
    console.error('[AUTH] REGISTER ERROR:', err.message);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

/* =======================
   LOGIN LAWYER
======================= */
exports.loginLawyer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  try {
    /* ========= MONGO MODE ========= */
    if (dataMode.mode === 'MONGO') {
      const lawyer = await Lawyer
        .findOne({ email: email.toLowerCase() })
        .select('+password');

      if (!lawyer || !(await lawyer.matchPassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const obj = lawyer.toObject();
      delete obj.password;

      console.log(`[AUTH] LOGIN ${email} (MongoDB)`);

      return res.json({
        success: true,
        message: 'Login successful',
        lawyer: obj
      });
    }

    /* ========= JSON MODE ========= */
    const lawyers = readLawyersJSON();
    const lawyer = lawyers.find(l => l.email === email.toLowerCase());

    if (!lawyer || !(await bcrypt.compare(password, lawyer.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const copy = { ...lawyer };
    delete copy.password;

    console.log(`[AUTH] LOGIN ${email} (JSON)`);

    res.json({
      success: true,
      message: 'Login successful',
      lawyer: copy
    });

  } catch (err) {
    console.error('[AUTH] LOGIN ERROR:', err.message);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

/* =======================
   GET ALL LAWYERS (ADMIN)
======================= */
exports.getAllRegisteredLawyers = async (req, res) => {
  try {
    if (dataMode.mode === 'MONGO') {
      const lawyers = await Lawyer.find({ isActive: true }).select('-password');
      console.log(`[ADMIN] FETCHED ${lawyers.length} lawyers (MongoDB)`);
      return res.json({ success: true, lawyers });
    }

    const lawyers = readLawyersJSON().map(l => {
      const c = { ...l };
      delete c.password;
      return c;
    });

    console.log(`[ADMIN] FETCHED ${lawyers.length} lawyers (JSON)`);

    res.json({ success: true, lawyers });

  } catch (err) {
    console.error('[ADMIN] FETCH ERROR:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch lawyers' });
  }
};
