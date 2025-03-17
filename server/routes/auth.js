// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { body, validationResult } = require('express-validator');

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.uid },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const result = await pool.query(
      'INSERT INTO "User" (fname, lname, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING uid, email, fname, lname',
      [username, username, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.uid },
      process.env.JWT_SECRET || 'your-secret-key',
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

module.exports = router;