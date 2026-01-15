require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./server/models/Product');
const SellerProfile = require('./server/models/SellerProfile');
const User = require('./server/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tradeportal');

async function checkSellerStatusImpact() {
  try {
    console.log('🔍 Checking products that are approved and verified...\n');
    
    // Find products that are approved and verified
    const approvedProducts = await Product.find({
      approved: true,
      verified: true
    }).populate('seller', 'name email role _id');
    
    console.log(`Found ${approvedProducts.length} products with approved=true and verified=true\n`);
    
    for (let product of approvedProducts) {
      console.log(`📦 Product: ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Seller: ${product.seller?.name} (${product.seller?.email})`);
      console.log(`   Seller ID: ${product.seller?._id}`);
      console.log(`   Status: ${product.status}`);
      console.log(`   Approved: ${product.approved}`);
      console.log(`   Verified: ${product.verified}`);
      
      // Check seller profile status
      const sellerProfile = await SellerProfile.findOne({ seller: product.seller._id });
      if (sellerProfile) {
        console.log(`   🏪 Seller Profile Status: ${sellerProfile.status}`);
        console.log(`   🏪 Onboarding Completed: ${sellerProfile.onboardingCompleted}`);
        console.log(`   🏪 Shop Name: ${sellerProfile.shopName}`);
        console.log(`   🏪 Slug: ${sellerProfile.slug}`);
      } else {
        console.log(`   🏪 Seller Profile: NOT FOUND`);
      }
      
      console.log('---\n');
    }
    
    console.log('\n📊 Summary:');
    console.log(`Total products checked: ${approvedProducts.length}`);
    
    const productsWithInactiveSellers = [];
    for (let product of approvedProducts) {
      const sellerProfile = await SellerProfile.findOne({ seller: product.seller._id });
      if (!sellerProfile || sellerProfile.status !== 'active') {
        productsWithInactiveSellers.push(product);
      }
    }
    
    console.log(`Products with inactive/incomplete seller profiles: ${productsWithInactiveSellers.length}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking seller status impact:', error);
    mongoose.connection.close();
  }
}

checkSellerStatusImpact();