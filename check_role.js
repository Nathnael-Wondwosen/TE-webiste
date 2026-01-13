// Script to check a user's role in the database
require('dotenv').config();
const mongoose = require('mongoose');
const dbConfig = require('./server/config/db');

async function checkUserRole() {
  try {
    await dbConfig();
    console.log('Connected to database');
    
    const User = require('./server/models/User');
    
    const user = await User.findOne({ email: 'admin@example.com' });
    if (user) {
      console.log('User found:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('ID:', user._id.toString());
    } else {
      console.log('User not found');
    }
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUserRole();