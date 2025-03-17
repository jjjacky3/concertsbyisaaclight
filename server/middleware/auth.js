const jwt = require('jsonwebtoken');
const pool = require('../db');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user exists in database
    const userResult = await pool.query(
      'SELECT uid, email, fname, lname FROM "User" WHERE uid = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    // Add user info to request
    req.user = userResult.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = auth; 