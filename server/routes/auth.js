// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { body, validationResult } = require('express-validator');

// Get JWT secret with fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validation middleware
const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateRegistration = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('username').notEmpty().withMessage('Username is required')
];

// Login endpoint
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Check if user exists with detailed logging
    const userResult = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('Login failed: User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    console.log('User found:', { uid: user.uid, email: user.email });

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      console.log('Login failed: Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token with consistent payload structure
    const token = jwt.sign(
      { userId: user.uid },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful, token generated for user:', { uid: user.uid, email: user.email });

    // Return user info and token
    res.json({
      token,
      user: {
        uid: user.uid,
        email: user.email,
        fname: user.fname,
        lname: user.lname
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Registration endpoint
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const { email, password, username } = req.body;
    console.log('Registration attempt for email:', email);

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('Registration failed: Email already exists:', email);
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user - using username as both first and last name
    const result = await pool.query(
      'INSERT INTO "User" (fname, lname, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING uid, email, fname, lname',
      [username, username, email, hashedPassword]
    );

    const newUser = result.rows[0];
    console.log('User registered successfully:', { uid: newUser.uid, email: newUser.email });

    // Generate JWT token with consistent payload structure
    const token = jwt.sign(
      { userId: newUser.uid },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info and token
    res.status(201).json({
      token,
      user: {
        uid: newUser.uid,
        email: newUser.email,
        fname: newUser.fname,
        lname: newUser.lname
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Verify token endpoint (useful for checking if token is valid)
router.get('/verify', async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ valid: false, message: 'No token provided' });
    }
    
    // Support both "Bearer token" and raw token formats
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : authHeader;
    
    if (!token) {
      return res.status(401).json({ valid: false, message: 'Invalid token format' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user exists in database
    const userResult = await pool.query(
      'SELECT uid, email, fname, lname FROM "User" WHERE uid = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ valid: false, message: 'User not found' });
    }

    // Return success with user info
    res.json({ 
      valid: true, 
      user: userResult.rows[0] 
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ valid: false, message: 'Token expired' });
    }
    
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

module.exports = router;