const Lawyer = require('../models/Lawyer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Helper to use JSON fallback when MongoDB is not available
let mongoAvailable = true;

const checkMongoDB = async () => {
  if (!mongoAvailable) return false;
  try {
    await Lawyer.collection.stats();
    return true;
  } catch (err) {
    mongoAvailable = false;
    return false;
  }
};

// Register a lawyer
exports.registerLawyer = async (req, res) => {
  try {
    const { name, email, password, phone, caseTypes, languages, gender, yearsExperience, location, isProBono, bio } = req.body;

    if (!email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Email, password, and phone are required' });
    }

    // Check if lawyer already exists
    const existingLawyer = await Lawyer.findOne({ email: email.toLowerCase() });
    if (existingLawyer) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create lawyer (password will be hashed in pre-save hook)
    const lawyer = new Lawyer({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      caseTypes: caseTypes || [],
      languages: languages || [],
      gender: gender || 'other',
      yearsExperience: yearsExperience || 0,
      location: location || '',
      isProBono: isProBono || false,
      bio: bio || '',
      registeredAt: new Date(),
      isActive: true
    });

    await lawyer.save();

    // Return lawyer without password
    const lawyerObj = lawyer.toObject();
    delete lawyerObj.password;

    console.log('Lawyer registered successfully in MongoDB:', lawyerObj.email);
    res.status(201).json({
      success: true,
      message: 'Lawyer registered successfully',
      lawyer: lawyerObj
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ success: false, message: `${field} already registered` });
    }
    
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

// Login a lawyer
exports.loginLawyer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Try MongoDB first
    try {
      const lawyer = await Lawyer.findOne({ email: email.toLowerCase() }).select('+password');
      if (lawyer) {
        const isPasswordCorrect = await lawyer.matchPassword(password);
        if (!isPasswordCorrect) {
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Return lawyer without password
        const lawyerObj = lawyer.toObject();
        delete lawyerObj.password;

        console.log('Login successful via MongoDB:', email);
        res.status(200).json({
          success: true,
          message: 'Login successful',
          lawyer: lawyerObj
        });
        return;
      }
    } catch (mongoErr) {
      console.log('MongoDB not available, checking JSON fallback:', mongoErr.message);
    }

    // Fallback: Use JSON file for default lawyers
    const lawyersPath = path.join(__dirname, '../data/lawyers.json');
    const lawyers = JSON.parse(fs.readFileSync(lawyersPath, 'utf-8'));
    
    const lawyer = lawyers.find(l => l.email === email.toLowerCase() || l.contact?.email === email.toLowerCase());
    if (!lawyer) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, lawyer.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const lawyerCopy = { ...lawyer };
    delete lawyerCopy.password;

    console.log('Login successful via JSON fallback:', email);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      lawyer: lawyerCopy
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

// Get all registered lawyers for public listing
exports.getAllRegisteredLawyers = async (req, res) => {
  try {
    const { type, language, gender, minExperience, name } = req.query;

    const useMongoDB = await checkMongoDB();

    if (useMongoDB) {
      let query = { isActive: true };

      // Filter by name (case-insensitive, partial match)
      if (name) {
        const searchName = String(name).toLowerCase().trim();
        query.name = { $regex: searchName, $options: 'i' };
      }

      // Filter by case types
      if (type) {
        const types = type.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        if (types.length > 0) {
          query.caseTypes = { $in: types };
        }
      }

      // Filter by languages
      if (language) {
        const languages = language.split(',').map(l => l.trim()).filter(Boolean);
        if (languages.length > 0) {
          query.languages = { $in: languages };
        }
      }

      // Filter by gender
      if (gender && gender !== 'any') {
        query.gender = gender.toLowerCase();
      }

      // Filter by minimum experience
      if (minExperience) {
        query.yearsExperience = { $gte: parseInt(minExperience) };
      }

      const lawyers = await Lawyer.find(query).select('-password');

      res.status(200).json({
        success: true,
        count: lawyers.length,
        lawyers
      });
    } else {
      // Fallback: Use JSON file
      const lawyersPath = path.join(__dirname, '../data/lawyers.json');
      let lawyers = JSON.parse(fs.readFileSync(lawyersPath, 'utf-8'));

      // Apply filters
      if (name) {
        const searchName = String(name).toLowerCase().trim();
        lawyers = lawyers.filter(l => l.name?.toLowerCase().includes(searchName));
      }

      if (type) {
        const types = type.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        lawyers = lawyers.filter(l => l.caseTypes?.some(ct => types.includes(ct.toLowerCase())));
      }

      if (language) {
        const langs = language.split(',').map(l => l.trim()).filter(Boolean);
        lawyers = lawyers.filter(l => l.languages?.some(lang => langs.includes(lang)));
      }

      if (gender && gender !== 'any') {
        lawyers = lawyers.filter(l => l.gender?.toLowerCase() === gender.toLowerCase());
      }

      if (minExperience) {
        lawyers = lawyers.filter(l => (l.yearsExperience || 0) >= parseInt(minExperience));
      }

      // Remove passwords before sending
      const lawyersList = lawyers.map(l => {
        const copy = { ...l };
        delete copy.password;
        return copy;
      });

      res.status(200).json({
        success: true,
        count: lawyersList.length,
        lawyers: lawyersList
      });
    }
  } catch (error) {
    console.error('Get lawyers error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch lawyers' });
  }
};
