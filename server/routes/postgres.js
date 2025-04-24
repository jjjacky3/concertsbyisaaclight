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
        c.image_url as image_url,
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

// NEW ENDPOINT: Get artist reviews and ratings
router.get('/artist-reviews/:artistName', async (req, res) => {
  try {
    const { artistName } = req.params;
    
    // Convert dash-separated artist name to proper case for DB query
    const normalizedArtistName = artistName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    console.log('Fetching reviews for artist:', normalizedArtistName);
    
    // First query: Get all reviews for the artist's concerts
    const reviewsResult = await pool.query(`
      SELECT 
        r.rid,
        r.rating,
        r.review_text,
        r.created_at,
        u.uid,
        u.fname as user_fname,
        u.lname as user_lname,
        c.cid,
        t.name as tour_name,
        v.name as venue_name,
        v.city as venue_city,
        c.date
      FROM Review r
      JOIN Concert c ON r.cid = c.cid
      JOIN Artist a ON c.aid = a.aid
      JOIN "User" u ON r.uid = u.uid
      JOIN Tour t ON c.tid = t.tid
      JOIN Venue v ON c.vid = v.vid
      WHERE LOWER(a.fname || ' ' || a.lname) = LOWER($1)
      ORDER BY r.created_at DESC
    `, [normalizedArtistName]);
    
    // Second query: Get rating distribution
    const ratingDistributionResult = await pool.query(`
      SELECT 
        r.rating,
        COUNT(*) as count
      FROM Review r
      JOIN Concert c ON r.cid = c.cid
      JOIN Artist a ON c.aid = a.aid
      WHERE LOWER(a.fname || ' ' || a.lname) = LOWER($1)
        AND r.rating IS NOT NULL
      GROUP BY r.rating
      ORDER BY r.rating DESC
    `, [normalizedArtistName]);
    
    // Third query: Get percentage of "would go again" (ratings 4-5 as percentage of total)
    const goAgainResult = await pool.query(`
      SELECT
        SUM(CASE WHEN r.rating >= 4 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as go_again_percentage
      FROM Review r
      JOIN Concert c ON r.cid = c.cid
      JOIN Artist a ON c.aid = a.aid
      WHERE LOWER(a.fname || ' ' || a.lname) = LOWER($1)
        AND r.rating IS NOT NULL
    `, [normalizedArtistName]);
    
    // Fourth query: Get rating distribution by tour
    const tourRatingsResult = await pool.query(`
      SELECT 
        t.name as tour_name,
        r.rating,
        COUNT(*) as count
      FROM Review r
      JOIN Concert c ON r.cid = c.cid
      JOIN Artist a ON c.aid = a.aid
      JOIN Tour t ON c.tid = t.tid
      WHERE LOWER(a.fname || ' ' || a.lname) = LOWER($1)
        AND r.rating IS NOT NULL
      GROUP BY t.name, r.rating
      ORDER BY t.name, r.rating DESC
    `, [normalizedArtistName]);
    
    // Format the rating distribution for frontend
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistributionResult.rows.forEach(row => {
      ratingDistribution[row.rating] = parseInt(row.count);
    });
    
    // Format tour ratings for frontend
    const tourRatings = {};
    tourRatingsResult.rows.forEach(row => {
      if (!tourRatings[row.tour_name]) {
        tourRatings[row.tour_name] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      tourRatings[row.tour_name][row.rating] = parseInt(row.count);
    });
    
    // Calculate go again percentage (default to 0 if no reviews)
    const goAgainPercentage = goAgainResult.rows.length > 0 
      ? goAgainResult.rows[0].go_again_percentage 
      : 0;
    
    res.json({
      success: true,
      data: {
        reviews: reviewsResult.rows,
        ratingDistribution,
        tourRatings,
        goAgain: Math.round(goAgainPercentage),
        totalReviews: reviewsResult.rows.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching artist reviews:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
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
    price,
    image_url
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
      `INSERT INTO Concert (date, time, aid, vid, tid, price, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [concertDate, concertTime, artistId, venueId, tourId, price, image_url]
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
    const userId = req.user.uid;
    const result = await pool.query(`
      SELECT 
        c.cid,
        c.date,
        c.time,
        c.price,
        c.image_url,
        a.fname || ' ' || a.lname as artist_name,
        t.name as tour_name,
        v.name as venue_name,
        v.city,
        r.rating,
        r.review_text,
        CASE WHEN f.uid IS NOT NULL THEN true ELSE false END as favorite
      FROM Concert c
      JOIN Artist a ON c.aid = a.aid
      JOIN Tour t ON c.tid = t.tid
      JOIN Venue v ON c.vid = v.vid
      LEFT JOIN Review r ON c.cid = r.cid AND r.uid = $1
      LEFT JOIN Favorite f ON c.cid = f.cid AND f.uid = $1
      ORDER BY c.date DESC, c.time DESC
      LIMIT 50
    `, [userId]);
    
    // Transform the data to match the frontend expectations
    const concerts = result.rows.map(concert => ({
      ...concert,
      review: concert.rating ? {
        rating: concert.rating,
        text: concert.review_text
      } : null,
      favorite: concert.favorite
    }));

    res.json(concerts);
  } catch (error) {
    console.error('Error fetching user concerts:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Rate a concert
router.post('/concerts/:id/rate', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.uid;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    await client.query('BEGIN');

    // Check if review exists
    const existingReview = await client.query(
      'SELECT * FROM Review WHERE uID = $1 AND cID = $2',
      [userId, id]
    );

    let result;
    if (existingReview.rows.length > 0) {
      // Update existing review
      result = await client.query(
        'UPDATE Review SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE uID = $2 AND cID = $3 RETURNING *',
        [rating, userId, id]
      );
    } else {
      // Create new review
      result = await client.query(
        'INSERT INTO Review (uID, cID, rating) VALUES ($1, $2, $3) RETURNING *',
        [userId, id, rating]
      );
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error rating concert:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  } finally {
    client.release();
  }
});

// Update review text
router.post('/concerts/:id/review', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.uid;

    await client.query('BEGIN');

    // Check if review exists
    const existingReview = await client.query(
      'SELECT * FROM Review WHERE uID = $1 AND cID = $2',
      [userId, id]
    );

    let result;
    if (existingReview.rows.length > 0) {
      // Update existing review
      result = await client.query(
        'UPDATE Review SET review_text = $1, updated_at = CURRENT_TIMESTAMP WHERE uID = $2 AND cID = $3 RETURNING *',
        [text, userId, id]
      );
    } else {
      // Create new review with null rating
      result = await client.query(
        'INSERT INTO Review (uID, cID, rating, review_text) VALUES ($1, $2, NULL, $3) RETURNING *',
        [userId, id, text]
      );
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating review:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  } finally {
    client.release();
  }
});

// Toggle favorite status
router.post('/concerts/:id/favorite', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const userId = req.user.uid;
    
    console.log(`Favorite request - User ID: ${userId}, Concert ID: ${id}, Favorite: ${favorite}`);

    await client.query('BEGIN');

    if (favorite) {
      // Add to favorites
      console.log(`Adding concert ${id} to favorites for user ${userId}`);
      await client.query(
        'INSERT INTO Favorite (uID, cID) VALUES ($1, $2) ON CONFLICT (uID, cID) DO NOTHING',
        [userId, id]
      );
    } else {
      // Remove from favorites
      console.log(`Removing concert ${id} from favorites for user ${userId}`);
      await client.query(
        'DELETE FROM Favorite WHERE uID = $1 AND cID = $2',
        [userId, id]
      );
    }

    await client.query('COMMIT');
    console.log(`Successfully updated favorite status for concert ${id}`);
    res.json({ success: true, favorite });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating favorite status:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  } finally {
    client.release();
  }
});

module.exports = router;