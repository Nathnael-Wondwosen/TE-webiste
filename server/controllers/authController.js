const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const axios = require('axios');

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

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Buyer',
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
      // Create new user with default Buyer role
      user = await User.create({
        name,
        email,
        googleId: sub,
        picture,
        isOAuthUser: true, // Mark as OAuth user
        role: 'Buyer', // Default role for new users
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

module.exports = {
  register,
  login,
  getMe,
  googleAuth,
  refreshToken,
  createInitialAdmin,
  createAdminBySuper,
};
