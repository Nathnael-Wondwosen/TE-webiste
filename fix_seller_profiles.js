#!/usr/bin/env node

/**
 * Fix Seller Profile Status Script
 * Activates seller profiles that have completed onboarding but aren't active
 */

require('dotenv').config();
const mongoose = require('mongoose');
const SellerProfile = require('./server/models/SellerProfile');
const User = require('./server/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tradeportal');

async function fixSellerProfiles() {
  try {
    console.log('🔧 Fixing Seller Profile Status Issues...\n');
    
    // Find all seller profiles
    const allProfiles = await SellerProfile.find({}).populate('seller', 'name email role');
    console.log(`📊 Total seller profiles found: ${allProfiles.length}`);
    
    // Find profiles that should be active but aren't
    const inactiveProfiles = allProfiles.filter(profile => profile.status !== 'active');
    console.log(`⚠️  Inactive profiles: ${inactiveProfiles.length}`);
    
    let fixedCount = 0;
    
    for (let profile of inactiveProfiles) {
      console.log(`\n📋 Checking profile: ${profile.shopName || 'Unnamed Shop'}`);
      console.log(`   Status: ${profile.status}`);
      console.log(`   Onboarding Completed: ${profile.onboardingCompleted}`);
      console.log(`   Seller: ${profile.seller?.name} (${profile.seller?.email})`);
      console.log(`   Role: ${profile.seller?.role}`);
      
      // Check if this profile should be active
      if (profile.onboardingCompleted || profile.seller?.role === 'Seller') {
        console.log(`   🔄 Activating profile...`);
        profile.status = 'active';
        await profile.save();
        fixedCount++;
        console.log(`   ✅ Profile activated!`);
      } else {
        console.log(`   ℹ️  Profile remains inactive (incomplete onboarding)`);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Profiles checked: ${allProfiles.length}`);
    console.log(`   Profiles fixed: ${fixedCount}`);
    console.log(`   Still inactive: ${inactiveProfiles.length - fixedCount}`);
    
    if (fixedCount > 0) {
      console.log(`\n🎉 Successfully activated ${fixedCount} seller profiles!`);
      console.log(`   Their shops should now be accessible.`);
    } else {
      console.log(`\n✅ No profiles needed fixing.`);
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔧 Fix script completed.');
  }
}

// Run the fix
fixSellerProfiles();