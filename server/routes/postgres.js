// routes/postgres.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all artists
router.get('/artists', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Artist');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST new artist
router.post('/artists', async (req, res) => {
  const { fname, lname } = req.body;
  
  if (!fname || !lname) {
    return res.status(400).json({ message: 'First name and last name are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO Artist (fname, lname) VALUES ($1, $2) RETURNING *',
      [fname, lname]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET all venues
router.get('/venues', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Venue');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST new venue
router.post('/venues', async (req, res) => {
  const { name, city } = req.body;
  
  if (!name || !city) {
    return res.status(400).json({ message: 'Venue name and city are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO Venue (name, city) VALUES ($1, $2) RETURNING *',
      [name, city]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating venue:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET concert details with related information
router.get('/concert-details', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.cID, 
        a.fname || ' ' || a.lname AS artist_name,
        t.name AS tour_name,
        v.name AS venue_name,
        v.city,
        c.date,
        c.time
      FROM Concert c
      JOIN Artist a ON c.aID = a.aID
      JOIN Tour t ON c.tID = t.tID
      JOIN Venue v ON c.vID = v.vID
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching concert details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a complete concert (with artist, venue, tour)
router.post('/complete-concert', async (req, res) => {
  const { 
    artistFname, 
    artistLname, 
    venueName, 
    venueCity, 
    tourName, 
    concertDate, 
    concertTime 
  } = req.body;
  
  // Validate input
  if (!artistFname || !artistLname || !venueName || !venueCity || !tourName || !concertDate || !concertTime) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
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
    
    // Insert concert
    const concertRes = await client.query(
      'INSERT INTO Concert (date, time, aID, vID, tID) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [concertDate, concertTime, artistId, venueId, tourId]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({
      message: 'Concert created successfully',
      concertId: concertRes.rows[0].cid,
      artistId,
      venueId,
      tourId
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating concert:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
});

module.exports = router;