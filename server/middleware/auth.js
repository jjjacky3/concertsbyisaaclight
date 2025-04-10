// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Get JWT secret with fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
  try {
    // Get token from header with better error checking
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    if (!authHeader) {
      console.log('No Authorization header provided');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Support both "Bearer token" and raw token formats
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : authHeader;
      
    console.log('Extracted token:', token ? 'Token found' : 'No token');
    
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format, access denied' });
    }

    // Verify token with consistent secret
    console.log('Verifying token with secret...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token payload:', decoded);
    
    // Check if we have a userId in the token
    if (!decoded.userId) {
      console.log('Token missing userId property');
      return res.status(401).json({ message: 'Invalid token format, missing userId' });
    }

    // Query user from database
    console.log('Looking up user with id:', decoded.userId);
    const userResult = await pool.query(
      'SELECT uid, email, fname, lname FROM "User" WHERE uid = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'User not found, access denied' });
    }

    // User found, attach to request
    const user = userResult.rows[0];
    console.log('User authenticated:', user.email);
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    // Provide more specific error messages
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired, please login again' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, please login again' });
    }
    
    res.status(401).json({ message: 'Authentication failed: ' + error.message });
  }
};

module.exports = auth;