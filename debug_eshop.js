require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./server/models/Product');
const SellerProfile = require('./server/models/SellerProfile');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tradeportal');

async function debugEshopIssues() {
  try {
    console.log('🔍 Debugging Eshop Product Visibility Issues...\n');
    
    // 1. Check total products
    const totalProducts = await Product.countDocuments();
    console.log(`📊 Total Products in DB: ${totalProducts}`);
    
    // 2. Check products with approved=true
    const approvedProducts = await Product.countDocuments({ approved: true });
    console.log(`✅ Approved Products: ${approvedProducts}`);
    
    // 3. Check products with verified=true
    const verifiedProducts = await Product.countDocuments({ verified: true });
    console.log(`✅ Verified Products: ${verifiedProducts}`);
    
    // 4. Check products with approved=true AND verified=true
    const approvedAndVerified = await Product.countDocuments({ approved: true, verified: true });
    console.log(`✅ Approved AND Verified Products: ${approvedAndVerified}`);
    
    // 5. Check products by seller status
    console.log('\n📋 Checking products by seller status...');
    
    // Get all products with their seller populated
    const productsWithSellers = await Product.find({ approved: true })
      .populate('seller', 'name email role _id')
      .lean(); // Use lean() for better performance
    
    console.log(`Products with approved=true: ${productsWithSellers.length}`);
    
    // Group products by seller and check their profiles
    const sellerIds = [...new Set(productsWithSellers.map(p => p.seller?._id))];
    console.log(`Unique sellers with approved products: ${sellerIds.length}`);
    
    let activeSellers = 0;
    let activeSellerProducts = 0;
    
    for (const sellerId of sellerIds) {
      const profile = await SellerProfile.findOne({ seller: sellerId });
      const sellerProducts = productsWithSellers.filter(p => p.seller && p.seller._id.equals(sellerId));
      
      console.log(`\nSeller ID: ${sellerId}`);
      console.log(`  Seller Profile: ${profile ? 'Found' : 'NOT FOUND'}`);
      if (profile) {
        console.log(`  Profile Status: ${profile.status}`);
        console.log(`  Profile Shop Name: ${profile.shopName || 'N/A'}`);
        console.log(`  Products from this seller: ${sellerProducts.length}`);
      }
      
      if (profile && profile.status === 'active') {
        activeSellers++;
        activeSellerProducts += sellerProducts.length;
      }
    }
    
    console.log(`\n📈 SUMMARY:`);
    console.log(`Active sellers with approved products: ${activeSellers}`);
    console.log(`Products from active sellers: ${activeSellerProducts}`);
    
    // 6. Sample of products that should be visible
    console.log(`\n📝 SAMPLE of products that should appear in Eshop:`);
    const sampleProducts = await Product.find({ 
      approved: true 
    })
      .populate('seller', 'name email role _id')
      .populate('category', 'name slug');
    
    for (const product of sampleProducts) {
      const profile = await SellerProfile.findOne({ seller: product.seller._id });
      console.log(`- Product: "${product.name}" | Approved: ${product.approved} | Verified: ${product.verified} | Seller Status: ${profile?.status || 'NO PROFILE'}`);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error debugging Eshop issues:', error);
    mongoose.connection.close();
  }
}

debugEshopIssues();