const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

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

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
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

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ message: 'Unable to login' });
  }
};

const getMe = (req, res) => {
  res.json(req.user);
};

module.exports = {
  register,
  login,
  getMe,
};
