const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('./server/models/Product');
const User = require('./server/models/User');

async function fixSellerProducts() {
  try {
    console.log('🔍 Starting to fix seller products...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tradethiopia');
    console.log('✅ Connected to database\n');
    
    // Find all seller and prospective seller users
    const sellerUsers = await User.find({ 
      role: { $in: ['Seller', 'ProspectiveSeller'] } 
    });
    
    console.log(`👥 Found ${sellerUsers.length} seller users\n`);
    
    if (sellerUsers.length === 0) {
      console.log('❌ No seller users found. Exiting.');
      return;
    }
    
    // Update products for each seller
    let totalFixed = 0;
    
    for (const user of sellerUsers) {
      console.log(`🔄 Processing products for ${user.name} (${user.email}) - Role: ${user.role}`);
      
      // Find all products for this seller
      const products = await Product.find({ 
        seller: user._id 
      });
      
      console.log(`   📦 Found ${products.length} products`);
      
      for (const product of products) {
        let updated = false;
        
        // Check if product status is approved but approved/verified flags are false
        if (product.status === 'approved') {
          if (!product.approved) {
            product.approved = true;
            updated = true;
            console.log(`   ✅ Set approved=true for product: ${product.name}`);
          }
          
          if (!product.verified) {
            product.verified = true;
            updated = true;
            console.log(`   ✅ Set verified=true for product: ${product.name}`);
          }
        }
        
        // If the product status is pending but it belongs to an active seller, 
        // we might want to approve it (optional - commented out for safety)
        /*
        if (product.status === 'pending' && user.role === 'Seller') {
          product.status = 'approved';
          product.approved = true;
          product.verified = true;
          updated = true;
          console.log(`   ✅ Upgraded pending product to approved: ${product.name}`);
        }
        */
        
        if (updated) {
          await product.save();
          totalFixed++;
        }
      }
      
      console.log(`   🟢 Completed processing for ${user.name}\n`);
    }
    
    console.log(`\n🎉 Summary: Fixed ${totalFixed} product records`);
    console.log('✅ Process completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing seller products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  }
}

if (require.main === module) {
  fixSellerProducts();
}

module.exports = { fixSellerProducts };