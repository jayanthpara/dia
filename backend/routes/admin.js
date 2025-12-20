const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// POST /api/admin/login { password }
router.post('/login', (req, res) => {
  const provided = req.body?.password;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // If no password provided, allow open admin access
  if (!provided) return res.json({ ok: true, open: true });

  if (provided && provided === adminPassword) return res.json({ ok: true });
  return res.status(401).json({ ok: false, error: 'Invalid admin password' });
});

// Simple ping for admin auth
router.get('/me', adminAuth, (req, res) => res.json({ ok: true }));

// GET /api/admin/credentials - Get all lawyer credentials with registration details
router.get('/credentials', async (req, res) => {
  try {
    const lawyersPath = path.join(__dirname, '../data/lawyers.json');
    const lawyersData = JSON.parse(fs.readFileSync(lawyersPath, 'utf-8'));

    const credentials = lawyersData.map(lawyer => ({
      id: lawyer.id,
      name: lawyer.name,
      email: lawyer.contact?.email || lawyer.email || 'N/A',
      phone: lawyer.contact?.phone || lawyer.phone || 'N/A',
      caseTypes: lawyer.caseTypes || [],
      languages: lawyer.languages || [],
      gender: lawyer.gender || 'other',
      yearsExperience: lawyer.yearsExperience || 0,
      location: lawyer.location || '',
      isProBono: lawyer.isProBono || false,
      bio: lawyer.bio || '',
      registeredAt: lawyer.registeredAt || new Date().toISOString(),
      isActive: lawyer.isActive !== false
    }));

    res.status(200).json({
      success: true,
      count: credentials.length,
      credentials
    });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch credentials' });
  }
});

// GET /api/admin/credentials/search?query=searchterm - Search credentials by name or email
router.get('/credentials/search', async (req, res) => {
  try {
    const { query } = req.query;
    const lawyersPath = path.join(__dirname, '../data/lawyers.json');
    const lawyersData = JSON.parse(fs.readFileSync(lawyersPath, 'utf-8'));
    
    let filtered = lawyersData;
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = lawyersData.filter(lawyer => 
        lawyer.name?.toLowerCase().includes(lowerQuery) || 
        lawyer.contact?.email?.toLowerCase().includes(lowerQuery) ||
        lawyer.email?.toLowerCase().includes(lowerQuery)
      );
    }

    const credentials = filtered.map(lawyer => ({
      id: lawyer.id,
      name: lawyer.name,
      email: lawyer.contact?.email || lawyer.email || 'N/A',
      phone: lawyer.contact?.phone || lawyer.phone || 'N/A',
      caseTypes: lawyer.caseTypes || [],
      languages: lawyer.languages || [],
      gender: lawyer.gender || 'other',
      yearsExperience: lawyer.yearsExperience || 0,
      location: lawyer.location || '',
      isProBono: lawyer.isProBono || false,
      bio: lawyer.bio || '',
      registeredAt: lawyer.registeredAt || new Date().toISOString(),
      isActive: lawyer.isActive !== false
    }));

    res.status(200).json({
      success: true,
      count: credentials.length,
      credentials
    });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch credentials' });
  }
});

module.exports = router;