require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Lawyer = require('../models/Lawyer');

async function verification() {
  console.log('Starting MongoDB Verification...');
  let mongod;
  let connectionType = 'NONE';

  // 1. Connection
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log(`Attempting to connect to configured URI...`);

    // Connect with short timeout to fail fast if local/remote is down
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('✓ Connected to Configured MongoDB');
    connectionType = 'CONFIGURED';
  } catch (error) {
    console.log('⚠ Could not connect to configured MongoDB. Trying In-Memory Server...');
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✓ Connected to In-Memory MongoDB (Fallback)');
      connectionType = 'IN_MEMORY';
    } catch (memError) {
      console.error('✗ Failed to connect to In-Memory MongoDB:', memError.message);
      process.exit(1);
    }
  }

  // 2. Create
  const testEmail = `test.verify.${Date.now()}@example.com`;
  let createdId;
  try {
    const newLawyer = new Lawyer({
      name: 'Verification Test Lawyer',
      email: testEmail,
      password: 'TestPassword123!',
      phone: '+1-555-0100',
      caseTypes: ['verification'],
      location: 'Test City'
    });

    const savedLawyer = await newLawyer.save();
    createdId = savedLawyer._id;
    console.log('✓ Create Operation: Success');
    console.log(`  - Created ID: ${createdId}`);
  } catch (error) {
    console.error('✗ Create Operation Failed:', error.message);
    await cleanup();
    process.exit(1);
  }

  // 3. Read
  try {
    const foundLawyer = await Lawyer.findById(createdId);
    if (foundLawyer && foundLawyer.email === testEmail) {
      console.log('✓ Read Operation: Success');
    } else {
      throw new Error('Retrieved document does not match created document');
    }
  } catch (error) {
    console.error('✗ Read Operation Failed:', error.message);
    await cleanup();
    process.exit(1);
  }

  // 4. Delete
  try {
    await Lawyer.findByIdAndDelete(createdId);
    const checkDeleted = await Lawyer.findById(createdId);
    if (!checkDeleted) {
      console.log('✓ Delete Operation: Success');
    } else {
      throw new Error('Document was not deleted');
    }
  } catch (error) {
    console.error('✗ Delete Operation Failed:', error.message);
    await cleanup();
    process.exit(1);
  }

  console.log('\nAll verification steps passed successfully!');
  await cleanup();
  process.exit(0);

  async function cleanup() {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  }
}

verification();
