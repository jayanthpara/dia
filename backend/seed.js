const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Lawyer = require('./models/Lawyer');
const connectDB = require('./config/db');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing lawyers
    await Lawyer.deleteMany({});
    console.log('Cleared existing lawyers');

    // Read lawyers from JSON
    const lawyersPath = path.join(__dirname, './data/lawyers.json');
    const lawyersData = JSON.parse(fs.readFileSync(lawyersPath, 'utf-8'));

    // Create lawyers with default password based on their name
    const lawyers = lawyersData.map(lawyer => ({
      name: lawyer.name,
      email: `${lawyer.name.toLowerCase().replace(/\s+/g, '.')}@lawyer.com`,
      password: `${lawyer.name.split(' ')[0]}Pass123!`, // Simple default password
      phone: lawyer.contact?.phone || '+1-000-0000000',
      caseTypes: lawyer.caseTypes || [],
      languages: lawyer.languages || [],
      gender: lawyer.gender || 'other',
      yearsExperience: lawyer.yearsExperience || 0,
      location: lawyer.location || '',
      isProBono: lawyer.isProBono || false,
      bio: `Expert in ${(lawyer.caseTypes || []).join(', ') || 'legal matters'}`,
      registeredAt: new Date(),
      isActive: true
    }));

    const createdLawyers = await Lawyer.create(lawyers);
    console.log(`✓ Created ${createdLawyers.length} lawyers in MongoDB`);

    // Display created lawyers
    console.log('\nRegistered Lawyers:');
    createdLawyers.forEach(lawyer => {
      console.log(`  • ${lawyer.name}`);
      console.log(`    Email: ${lawyer.email}`);
      console.log(`    Password: ${lawyer.password}`);
      console.log('');
    });

    await mongoose.connection.close();
    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
