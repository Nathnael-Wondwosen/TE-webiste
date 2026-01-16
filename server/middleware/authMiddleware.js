const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserSession = require('../models/UserSession');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }
    
    // Check if user session has been invalidated
    const session = await UserSession.findOne({
      userId: decoded.id,
      isActive: false
    });
    
    if (session) {
      return res.status(401).json({ message: 'Account has been deactivated or deleted' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('authMiddleware error', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
