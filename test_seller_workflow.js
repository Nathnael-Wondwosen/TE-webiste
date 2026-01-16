#!/usr/bin/env node

/**
 * Test Script for Seller Hub Workflow
 * Verifies that products are properly created and visible across platforms
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./server/models/Product');
const SellerProfile = require('./server/models/SellerProfile');
const User = require('./server/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tradeportal');

async function testSellerWorkflow() {
  try {
    console.log('🧪 Testing Seller Hub Workflow...\n');
    
    // 1. Check if we have sellers in the system
    const sellers = await User.find({ role: 'Seller' });
    console.log(`👥 Found ${sellers.length} sellers in the system`);
    
    if (sellers.length === 0) {
      console.log('❌ No sellers found. Cannot test workflow.');
      return;
    }
    
    const testSeller = sellers[0];
    console.log(`📝 Using seller: ${testSeller.name} (${testSeller.email})\n`);
    
    // 2. Check seller's products
    const sellerProducts = await Product.find({ seller: testSeller._id });
    console.log(`📦 Seller has ${sellerProducts.length} products`);
    
    // 3. Check product approval status
    const approvedProducts = sellerProducts.filter(p => p.approved && p.verified);
    const pendingProducts = sellerProducts.filter(p => !p.approved || !p.verified);
    
    console.log(`✅ Approved products: ${approvedProducts.length}`);
    console.log(`⏳ Pending products: ${pendingProducts.length}\n`);
    
    // 4. Test visibility criteria
    console.log('🔍 Testing visibility criteria:');
    
    // Eshop/Marketplace visibility (approved AND verified)
    const eshopVisible = sellerProducts.filter(p => p.approved && p.verified);
    console.log(`🏪 Eshop/Marketplace visible: ${eshopVisible.length}/${sellerProducts.length}`);
    
    // Shop visibility (status approved AND approved flag)
    const shopVisible = sellerProducts.filter(p => p.status === 'approved' && p.approved);
    console.log(`🛍️  Shop visible: ${shopVisible.length}/${sellerProducts.length}`);
    
    // 5. Detailed product analysis
    console.log('\n📋 Product Details:');
    sellerProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Status: ${product.status}`);
      console.log(`   Approved: ${product.approved}`);
      console.log(`   Verified: ${product.verified}`);
      console.log(`   Eshop Visible: ${product.approved && product.verified ? '✅' : '❌'}`);
      console.log(`   Shop Visible: ${product.status === 'approved' && product.approved ? '✅' : '❌'}`);
      console.log('');
    });
    
    // 6. Test consistency
    console.log('⚖️  Consistency Check:');
    const inconsistentStatus = sellerProducts.filter(p => 
      (p.status === 'approved' && !p.approved) || 
      (p.approved && p.status !== 'approved')
    );
    
    if (inconsistentStatus.length > 0) {
      console.log('❌ Found inconsistent products:');
      inconsistentStatus.forEach(p => {
        console.log(`   - ${p.name}: status=${p.status}, approved=${p.approved}`);
      });
    } else {
      console.log('✅ All products have consistent status/approval values');
    }
    
    // 7. Check seller profile
    const sellerProfile = await SellerProfile.findOne({ seller: testSeller._id });
    if (sellerProfile) {
      console.log(`\n🏪 Seller Profile:`);
      console.log(`   Shop Name: ${sellerProfile.shopName}`);
      console.log(`   Status: ${sellerProfile.status}`);
      console.log(`   Slug: ${sellerProfile.slug}`);
      console.log(`   Shop URL: /shop/${sellerProfile.slug}`);
    } else {
      console.log('\n⚠️  No seller profile found for this seller');
    }
    
    // 8. Summary
    console.log('\n📊 Summary:');
    console.log(`   Total Products: ${sellerProducts.length}`);
    console.log(`   Fully Visible: ${eshopVisible.length} (approved & verified)`);
    console.log(`   Shop Visible: ${shopVisible.length} (status approved & approved)`);
    console.log(`   Inconsistent: ${inconsistentStatus.length}`);
    
    if (eshopVisible.length === sellerProducts.length) {
      console.log('\n🎉 SUCCESS: All seller products are properly visible!');
    } else {
      console.log('\n⚠️  WARNING: Some products may not be visible on all platforms');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🧪 Test completed.');
  }
}

// Run the test
testSellerWorkflow();