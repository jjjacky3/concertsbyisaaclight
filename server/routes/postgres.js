// routes/postgres.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Validation middleware
const validateArtist = [
  body('fname').trim().notEmpty().withMessage('First name is required'),
  body('lname').trim().notEmpty().withMessage('Last name is required')
];

const validateVenue = [
  body('name').trim().notEmpty().withMessage('Venue name is required'),
  body('city').trim().notEmpty().withMessage('City is required')
];

const validateConcert = [
  body('artistFname').trim().notEmpty().withMessage('Artist first name is required'),
  body('artistLname').trim().notEmpty().withMessage('Artist last name is required'),
  body('venueName').trim().notEmpty().withMessage('Venue name is required'),
  body('venueCity').trim().notEmpty().withMessage('Venue city is required'),
  body('tourName').trim().notEmpty().withMessage('Tour name is required'),
  body('concertDate').isDate().withMessage('Valid concert date is required'),
  body('concertTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid concert time is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET all artists
router.get('/artists', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Artist ORDER BY fname, lname');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// POST new artist
router.post('/artists', validateArtist, handleValidationErrors, async (req, res) => {
  const { fname, lname } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO Artist (fname, lname) VALUES ($1, $2) RETURNING *',
      [fname, lname]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating artist:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ message: 'Artist already exists' });
    } else {
      res.status(500).json({ 
        message: 'Server error', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  }
});

// GET all venues
router.get('/venues', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Venue ORDER BY city, name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// POST new venue
router.post('/venues', validateVenue, handleValidationErrors, async (req, res) => {
  const { name, city } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO Venue (name, city) VALUES ($1, $2) RETURNING *',
      [name, city]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating venue:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ message: 'Venue already exists' });
    } else {
      res.status(500).json({ 
        message: 'Server error', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  }
});

// GET concert details with related information
router.get('/concert-details', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.cid,
        c.date,
        c.time,
        c.price,
        a.fname || ' ' || a.lname as artist_name,
        t.name as tour_name,
        v.name as venue_name,
        v.city
      FROM Concert c
      JOIN Artist a ON c.aid = a.aid
      JOIN Tour t ON c.tid = t.tid
      JOIN Venue v ON c.vid = v.vid
      ORDER BY c.date DESC, c.time DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching concert details:', err);
    res.status(500).json({ error: 'Failed to fetch concert details' });
  }
});

// Create a complete concert (with artist, venue, tour)
router.post('/complete-concert', validateConcert, handleValidationErrors, async (req, res) => {
  const { 
    artistFname, 
    artistLname, 
    venueName, 
    venueCity, 
    tourName, 
    concertDate, 
    concertTime,
    price 
  } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert or find artist
    const artistRes = await client.query(
      'INSERT INTO Artist (fname, lname) VALUES ($1, $2) ON CONFLICT (fname, lname) DO UPDATE SET fname = $1 RETURNING aID',
      [artistFname, artistLname]
    );
    const artistId = artistRes.rows[0].aid;
    
    // Insert or find venue
    const venueRes = await client.query(
      'INSERT INTO Venue (name, city) VALUES ($1, $2) ON CONFLICT (name, city) DO UPDATE SET name = $1 RETURNING vID',
      [venueName, venueCity]
    );
    const venueId = venueRes.rows[0].vid;
    
    // Insert or find tour
    const tourRes = await client.query(
      'INSERT INTO Tour (aID, name) VALUES ($1, $2) ON CONFLICT (aID, name) DO UPDATE SET name = $2 RETURNING tID',
      [artistId, tourName]
    );
    const tourId = tourRes.rows[0].tid;
    
    // Insert concert with price
    const concertRes = await client.query(
      'INSERT INTO Concert (date, time, aID, vID, tID, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [concertDate, concertTime, artistId, venueId, tourId, price]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({
      message: 'Concert created successfully',
      concert: concertRes.rows[0],
      artistId,
      venueId,
      tourId
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating concert:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ message: 'Concert already exists' });
    } else {
      res.status(500).json({ 
        message: 'Server error', 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  } finally {
    client.release();
  }
});

// Get user's concerts
router.get('/user-concerts', auth, async (req, res) => {
  try {
    // Get user's concerts from the database
    const result = await pool.query(`
      SELECT 
        c.cid,
        c.date,
        c.time,
        c.price,
        a.fname || ' ' || a.lname as artist_name,
        t.name as tour_name,
        v.name as venue_name,
        v.city
      FROM Concert c
      JOIN Artist a ON c.aid = a.aid
      JOIN Tour t ON c.tid = t.tid
      JOIN Venue v ON c.vid = v.vid
      ORDER BY c.date DESC, c.time DESC
      LIMIT 50
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user concerts:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

module.exports = router;