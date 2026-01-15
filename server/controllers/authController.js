const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const SellerProfile = require('../models/SellerProfile');
const axios = require('axios');
const bcryptjs = require('bcryptjs');

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const generateTokens = (userId, role) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    console.error('JWT_REFRESH_SECRET is not defined in environment variables');
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }
  return {
    token: generateToken(userId),
    refreshToken: jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
    role,
  };
};

const createInitialAdmin = async (req, res) => {
  try {
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'Admin' });
    
    if (existingAdmin) {
      return res.status(400).json({ message: 'An admin user already exists' });
    }
    
    const { email, name, password } = req.body;
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }
    
    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    
    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'Admin',
      verified: true, // Admins are automatically verified
    });
    
    await adminUser.save();
    
    // Return tokens for immediate login
    const tokens = generateTokens(adminUser._id, 'Admin');
    
    res.status(201).json({
      ...tokens,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Create initial admin error', error);
    res.status(500).json({ message: 'Unable to create admin user' });
  }
};

const createAdminBySuper = async (req, res) => {
  try {
    // Only allow if the requesting user is already an admin
    if (req.user && req.user.role === 'Admin') {
      const { email, name, password } = req.body;
      
      // Check if user with this email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }
      
      // Hash the password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      
      const adminUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'Admin',
        verified: true, // Admins are automatically verified
      });
      
      await adminUser.save();
      
      // Return user info (without tokens since this admin wasn't the one who logged in)
      res.status(201).json({
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    } else {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
  } catch (error) {
    console.error('Create admin by super error', error);
    res.status(500).json({ message: 'Unable to create admin user' });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    let companyDoc = null;
    if (company) {
      companyDoc = await Company.create(company);
    }

    // Handle role assignment based on user request
    let assignedRole = 'Buyer'; // Default role
    
    if (role === 'Seller') {
      // For sellers, assign 'ProspectiveSeller' initially
      // They will go through onboarding before becoming active sellers
      assignedRole = 'ProspectiveSeller';
    } else if (['Admin', 'Buyer'].includes(role)) {
      assignedRole = role;
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      company: companyDoc ? companyDoc._id : undefined,
    });

    const tokens = generateTokens(user._id, user.role);
    
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ message: 'Unable to register user' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokens = generateTokens(user._id, user.role);
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ message: 'Unable to login' });
  }
};

const getMe = (req, res) => {
  res.json(req.user);
};

// Google OAuth function
const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    // Verify the token with Google
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`);
    const { email, name, picture, sub } = response.data;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update profile picture if it changed
      if (user.googleId !== sub) {
        user.googleId = sub;
      }
      if (user.picture !== picture) {
        user.picture = picture;
      }
      await user.save();
    } else {
      // For OAuth registration, check if role was specified in request
      // Otherwise default to Buyer role
      const requestedRole = req.body.role;
      let assignedRole = 'Buyer'; // Default role
      
      if (requestedRole === 'Seller') {
        // For sellers, assign 'ProspectiveSeller' initially
        assignedRole = 'ProspectiveSeller';
      } else if (['Admin', 'Buyer'].includes(requestedRole)) {
        assignedRole = requestedRole;
      }
      
      user = await User.create({
        name,
        email,
        googleId: sub,
        picture,
        isOAuthUser: true, // Mark as OAuth user
        role: assignedRole, // Assign role based on request or default
      });
    }

    const tokens = generateTokens(user._id, user.role);
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
      ...tokens,
    });
  } catch (error) {
    console.error('Google auth error', error);
    res.status(500).json({ message: 'Google authentication failed: ' + error.message });
  }
};

// Refresh token function
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }
    
    const newToken = generateToken(decoded.id);
    res.json({ token: newToken });
  } catch (error) {
    console.error('Refresh token error', error);
    res.status(500).json({ message: 'Unable to refresh token' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    // Only admins or the user themselves can update role-related info
    if (req.user.role !== 'Admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { userId } = req.params;
    const { role } = req.body;
    
    // Only allow certain role transitions
    const validTransitions = {
      'ProspectiveSeller': ['Seller'], // Can become a seller after onboarding
      'Seller': ['ProspectiveSeller'], // Can downgrade back to pending
      'Buyer': [] // Buyers remain buyers unless admin changes
    };
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Allow admin to change any role, or auto-promotion for onboarding
    if (req.user.role === 'Admin' || 
        (user._id.toString() === req.user._id.toString() && 
         user.role === 'ProspectiveSeller' && 
         role === 'Seller' &&
         req.body.completedOnboarding)) {
      
      if (role && validTransitions[user.role]?.includes(role)) {
        user.role = role;
        
        // If admin is promoting a ProspectiveSeller to Seller, ensure they have a SellerProfile
        // and update their existing products to be approved
        if (req.user.role === 'Admin' && user.role === 'ProspectiveSeller' && role === 'Seller') {
          const SellerProfile = require('../models/SellerProfile');
          const Product = require('../models/Product');
          const existingProfile = await SellerProfile.findOne({ seller: userId });
          
          if (!existingProfile) {
            // Create a basic seller profile if one doesn't exist
            const baseName = user.name || 'Seller Shop';
            const createSlug = (value) =>
              value
                ? value
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                : undefined;
            
            await SellerProfile.create({
              seller: userId,
              shopName: baseName,
              slug: createSlug(baseName),
              contactEmail: user.email,
              status: 'active', // Set to active since admin is promoting
            });
          } else {
            // If profile exists but status is not active, set it to active
            if (existingProfile.status !== 'active') {
              existingProfile.status = 'active';
              await existingProfile.save();
            }
          }
          
          // Update all existing products for this user to be approved
          await Product.updateMany(
            { seller: userId, status: 'pending' },
            { 
              status: 'approved',
              approved: true,
              verified: true
            }
          );
        }
        
        await user.save();
        
        res.json({
          message: `User role updated to ${role}`,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        });
      } else {
        res.status(400).json({ message: 'Invalid role transition' });
      }
    } else {
      res.status(403).json({ message: 'Insufficient permissions for role change' });
    }
    
  } catch (error) {
    console.error('Update user role error', error);
    res.status(500).json({ message: 'Unable to update user role' });
  }
};

const getProspectiveSellers = async (req, res) => {
  try {
    // Only admins can access this endpoint
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // First, find all users with ProspectiveSeller role
    const users = await User.find({ role: 'ProspectiveSeller' })
      .select('name email createdAt _id') // Only return necessary fields
      .lean(); // Use lean() to get plain JS objects
    
    // Then, find seller profiles for these users
    const userIds = users.map(user => user._id);
    const sellerProfiles = await SellerProfile.find({ seller: { $in: userIds } })
      .select('contactPhone contactEmail shopName bio onboardingCompleted')
      .lean();
    
    // Combine the data
    const result = users.map(user => {
      const profile = sellerProfiles.find(p => p.seller.toString() === user._id.toString());
      return {
        ...user,
        sellerProfile: profile || null
      };
    });
    
    res.json(result);
  } catch (error) {
    console.error('Get prospective sellers error', error);
    res.status(500).json({ message: 'Unable to fetch prospective sellers' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  googleAuth,
  refreshToken,
  createInitialAdmin,
  createAdminBySuper,
  updateUserRole,
  getProspectiveSellers,
};
