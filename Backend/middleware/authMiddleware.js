const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'smartgn_jwt_secret_key_987654321';

// Verify token and append user info to req
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Middleware to restrict access to ADMIN only
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access forbidden. Administrative privileges required.' });
  }
  
  next();
};

// Middleware to restrict access to ADMIN or OFFICER
const requireOfficerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  
  if (req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Access forbidden. Officer or Admin privileges required.' });
  }
  
  next();
};