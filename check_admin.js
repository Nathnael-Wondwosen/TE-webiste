// Simple script to check if an admin user already exists
const mongoose = require('mongoose');

// Use the server's db config
const dbConfig = require('./server/config/db');

async function checkAdmin() {
  try {
    // Connect to database using server's config
    await dbConfig();
    console.log('Connected to database');
    
    // Import User model
    const User = require('./server/models/User');
    
    // Check if any admin exists
    const admin = await User.findOne({ role: 'Admin' });
    
    if (admin) {
      console.log('Admin user already exists:');
      console.log('- ID:', admin._id);
      console.log('- Name:', admin.name);
      console.log('- Email:', admin.email);
      console.log('- Role:', admin.role);
    } else {
      console.log('No admin user found. You can create one.');
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error checking admin:', error);
  }
}

checkAdmin();