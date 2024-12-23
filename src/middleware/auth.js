const jwt = require('jsonwebtoken');
const { CustomError } = require('../utils/errors');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new CustomError('Unauthorized', 401);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    throw new CustomError('Invalid token', 403);
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError('Forbidden', 403);
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};