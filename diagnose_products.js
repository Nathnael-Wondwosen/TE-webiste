// Diagnostic script to check product visibility issues
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/trade-ethiopia');

const Product = require('./server/models/Product');
const User = require('./server/models/User');

async function diagnoseProductVisibility() {
  try {
    console.log('🔍 Diagnosing Product Visibility Issues...\n');
    
    // Find all products and their status
    const products = await Product.find({})
      .populate('seller', 'name email role')
      .select('name status approved verified seller role')
      .lean();
    
    console.log('📊 All Products:');
    console.log('==================');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   - Status: ${product.status}`);
      console.log(`   - Approved: ${product.approved}`);
      console.log(`   - Verified: ${product.verified}`);
      console.log(`   - Seller Role: ${product.seller?.role || 'Unknown'}`);
      console.log(`   - Visible in Eshop: ${product.approved && product.verified ? '✅ Yes' : '❌ No'}`);
      console.log(`   - Visible in Seller Shop: ${product.status === 'approved' && product.approved ? '✅ Yes' : '❌ No'}`);
      console.log('');
    });
    
    // Count statistics
    const totalProducts = products.length;
    const eshopVisible = products.filter(p => p.approved && p.verified).length;
    const shopVisible = products.filter(p => p.status === 'approved' && p.approved).length;
    const sellerProducts = products.filter(p => p.seller?.role === 'Seller').length;
    const prospectiveSellerProducts = products.filter(p => p.seller?.role === 'ProspectiveSeller').length;
    
    console.log('\n📈 Statistics:');
    console.log('===============');
    console.log(`Total Products: ${totalProducts}`);
    console.log(`Eshop Visible: ${eshopVisible}`);
    console.log(`Seller Shop Visible: ${shopVisible}`);
    console.log(`Products by Sellers: ${sellerProducts}`);
    console.log(`Products by Prospective Sellers: ${prospectiveSellerProducts}`);
    
    // Check for inconsistencies
    console.log('\n⚠️  Potential Issues:');
    console.log('====================');
    
    const inconsistentStatus = products.filter(p => 
      (p.status === 'approved' && !p.approved) || 
      (p.approved && p.status !== 'approved')
    );
    
    if (inconsistentStatus.length > 0) {
      console.log('Products with inconsistent status/approved values:');
      inconsistentStatus.forEach(p => {
        console.log(`- ${p.name}: status=${p.status}, approved=${p.approved}`);
      });
    } else {
      console.log('No status inconsistencies found.');
    }
    
    const missingVerified = products.filter(p => p.approved && !p.verified);
    if (missingVerified.length > 0) {
      console.log('\nProducts approved but not verified (won\'t show in Eshop):');
      missingVerified.forEach(p => {
        console.log(`- ${p.name}: approved=${p.approved}, verified=${p.verified}`);
      });
    } else {
      console.log('\nAll approved products are also verified.');
    }
    
  } catch (error) {
    console.error('Diagnostic error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔍 Diagnostic complete.');
  }
}

// Run the diagnostic
diagnoseProductVisibility();