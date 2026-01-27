const mongoose = require('mongoose');
const User = require('./server/models/User');
const Company = require('./server/models/Company');

require('dotenv').config();

async function fixCompanyData() {
  try {
    // Connect to MongoDB
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/tradethiopia';
    console.log(`Attempting to connect to: ${connectionString}`);
    await mongoose.connect(connectionString);
    
    console.log('Connected to database, starting company data fix...');
    
    // Find all users that have a company field that looks like a hex string
    const users = await User.find({});
    
    for (const user of users) {
      if (user.company) {
        // Check if the company field is a hex-encoded string
        if (typeof user.company === 'string' && /^[0-9a-fA-F]+$/.test(user.company)) {
          console.log(`Found problematic company field for user ${user.name}: ${user.company}`);
          
          // This means the hex string was stored directly instead of linking to a Company doc
          // We need to decode the hex string to get the original company name
          let companyName;
          try {
            companyName = Buffer.from(user.company, 'hex').toString();
            console.log(`Decoded company name: ${companyName}`);
          } catch (decodeError) {
            console.log(`Could not decode hex string for user ${user.name}: ${user.company}`);
            continue; // Skip this user
          }
          
          // Create a proper company document
          const companyDoc = await Company.create({
            name: companyName,
            country: user.country || '',
            description: `${companyName} - Created from legacy data`
          });
          
          // Update the user to reference the proper company document
          await User.findByIdAndUpdate(
            user._id,
            { company: companyDoc._id },
            { new: true }
          );
          
          console.log(`Fixed company reference for user ${user.name}`);
        }
      }
    }
    
    console.log('Company data fix completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing company data:', error);
    process.exit(1);
  }
}

fixCompanyData();