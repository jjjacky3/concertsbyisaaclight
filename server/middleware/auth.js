const jwt = require('jsonwebtoken');
const pool = require('../db');

const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware - headers:', req.headers);
    
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Extracted token:', token);
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('Using secret key:', secret);
    
    const decoded = jwt.verify(token, secret);
    console.log('Decoded token:', decoded);
    
    // Check if user exists in database
    const userResult = await pool.query(
      'SELECT uid, email, fname, lname FROM "User" WHERE uid = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      console.log('User not found in database');
      throw new Error('User not found');
    }

    console.log('User found:', userResult.rows[0]);

    // Add user info to request
    req.user = userResult.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = auth; 