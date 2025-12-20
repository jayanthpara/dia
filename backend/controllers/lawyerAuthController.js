const Lawyer = require('../models/Lawyer');
// ...existing code...
const bcrypt = require('bcrypt');

// ...existing code...

// Register a lawyer
exports.registerLawyer = async (req, res) => {
  try {
    const { name, email, password, phone, caseTypes, languages, gender, yearsExperience, location, isProBono, bio } = req.body;

    if (!email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Email, password, and phone are required' });
    }

    const useMongoDB = await checkMongoDB();

    if (useMongoDB) {
      // Check if lawyer already exists
      const existingLawyer = await Lawyer.findOne({ email: email.toLowerCase() });
      if (existingLawyer) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      // Create lawyer
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
        // Create lawyer
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
        res.status(201).json({
          success: true,
          message: 'Lawyer registered successfully',
          lawyer: lawyerObj
        });
      } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: error.message || 'Registration failed' });
      }
      // Fallback: Use JSON file
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

      res.status(200).json({
        success: true,
        message: 'Login successful (JSON fallback)',
        lawyer: lawyerCopy
      });
    }
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
