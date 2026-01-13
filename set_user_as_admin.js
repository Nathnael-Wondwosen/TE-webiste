// Script to update a user's role to Admin directly in the database
const mongoose = require('mongoose');

// Use the server's db config
const dbConfig = require('./server/config/db');

async function setUserAsAdmin(email) {
  try {
    // Connect to database using server's config
    await dbConfig();
    console.log('Connected to database');
    
    // Import User model
    const User = require('./server/models/User');
    
    // Find user by email
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.log(`User with email ${email} not found.`);
      console.log('Available users:');
      const allUsers = await User.find({}, 'name email role');
      allUsers.forEach(u => {
        console.log(`- ${u.name} (${u.email}) - Role: ${u.role}`);
      });
    } else {
      console.log(`Found user: ${user.name} (${user.email})`);
      console.log(`Current role: ${user.role}`);
      
      // Update user role to Admin
      user.role = 'Admin';
      await user.save();
      
      console.log(`Successfully updated user role to Admin!`);
      console.log(`User ${user.name} is now an administrator.`);
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}

// Get email from command line arguments or use default
const email = process.argv[2] || 'tradethiopia@gmail.com';
console.log(`Attempting to set user with email "${email}" as admin...`);

setUserAsAdmin(email);