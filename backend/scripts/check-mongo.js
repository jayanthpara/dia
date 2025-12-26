#!/usr/bin/env node
/**
 * MongoDB Connection Diagnostic Tool
 * Run this to test your MongoDB connection independently
 * Usage: node backend/scripts/check-mongo.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function checkConnection() {
    console.log('='.repeat(60));
    console.log('MongoDB Connection Diagnostic');
    console.log('='.repeat(60));
    console.log();

    // Step 1: Check environment variable
    console.log('1. Checking MONGODB_URI environment variable...');
    if (!process.env.MONGODB_URI) {
        console.error('   ❌ MONGODB_URI is NOT SET');
        console.error('   → Create a .env file in the backend directory');
        console.error('   → Add: MONGODB_URI=your-mongodb-connection-string');
        process.exit(1);
    }

    // Mask the password for security
    const maskedUri = process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@');
    console.log('   ✅ MONGODB_URI is set');
    console.log(`   → ${maskedUri}`);
    console.log();

    // Step 2: Test connection
    console.log('2. Testing MongoDB connection...');
    console.log('   (This may take up to 30 seconds)');

    const startTime = Date.now();

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(`   ✅ Connection successful! (${duration}s)`);
        console.log(`   → Database: ${mongoose.connection.name}`);
        console.log(`   → Host: ${mongoose.connection.host}`);
        console.log();

        // Step 3: Test database operations
        console.log('3. Testing database operations...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`   ✅ Found ${collections.length} collections`);
        if (collections.length > 0) {
            console.log('   → Collections:', collections.map(c => c.name).join(', '));
        }
        console.log();

        console.log('='.repeat(60));
        console.log('✅ ALL CHECKS PASSED - MongoDB is working correctly!');
        console.log('='.repeat(60));

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.error(`   ❌ Connection failed! (${duration}s)`);
        console.error(`   → Error: ${error.message}`);
        console.log();

        // Provide specific troubleshooting advice
        console.log('Troubleshooting:');
        if (error.message.includes('ENOTFOUND')) {
            console.log('   → DNS resolution failed');
            console.log('   → Check that your MongoDB URI hostname is correct');
        } else if (error.message.includes('authentication failed')) {
            console.log('   → Authentication failed');
            console.log('   → Verify your username and password in MONGODB_URI');
        } else if (error.message.includes('timeout')) {
            console.log('   → Connection timeout');
            console.log('   → Check your network connection');
            console.log('   → Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.log('   → Connection refused');
            console.log('   → Is MongoDB running?');
            console.log('   → Check if the port is correct');
        }
        console.log();

        console.log('='.repeat(60));
        console.log('❌ CHECKS FAILED - See errors above');
        console.log('='.repeat(60));

        await mongoose.disconnect();
        process.exit(1);
    }
}

checkConnection();
