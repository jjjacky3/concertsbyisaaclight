require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Set very generous timeouts
  connectionTimeoutMillis: 300000, // 5 minutes
  idleTimeoutMillis: 300000, // 5 minutes
  query_timeout: 300000 // 5 minutes
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

// Test the connection immediately
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection test failed:', err);
  } else {
    console.log('PostgreSQL connection test successful:', res.rows[0]);
  }
});

module.exports = pool;

async function getWishlist(uID) {
  try {
    const query = `
      SELECT cID
      FROM Wishlist
      WHERE uID = $1
    `;
    const { rows } = await pool.query(query, [uID]);
    return rows;
  } catch (err) {
    console.error('Error fetching wishlisted concerts:', err);
    throw new Error('Failed to fetch wishlisted concerts');
  }
}

async function addToWishlist(uID, cID) {
  try {
    const query = `
      INSERT INTO Wishlist (uID, cID)
      VALUES ($1, $2)
      ON CONFLICT (uID, cID) DO NOTHING
    `;
    await pool.query(query, [uID, cID]);
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    throw new Error('Failed to add to wishlist');
  }
}

async function removeFromWishlist(uID, cID) {
  try {
    const query = `
      DELETE FROM Wishlist
      WHERE uID = $1 AND cID = $2
    `;
    await pool.query(query, [uID, cID]);
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    throw new Error('Failed to remove from wishlist');
  }
}
