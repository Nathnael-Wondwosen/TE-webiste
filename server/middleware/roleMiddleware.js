const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: 'User not found in request context' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};

module.exports = allowRoles;
