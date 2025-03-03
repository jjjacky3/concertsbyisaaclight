const { Pool } = require('pg');
require('dotenv').config();  // Ensure you have the .env file for credentials

// Create a new pool instance using environment variables for database credentials
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to select all rows from the Artist table
async function getAllArtists() {
  const query = 'SELECT * FROM Artist';
  try {
    const res = await pool.query(query);
    console.log('All Artists:', res.rows);
  } catch (err) {
    console.error('Error fetching artists:', err.stack);
  }
}

// Function to select all rows from the User table
async function getAllUsers() {
  const query = 'SELECT * FROM "User"';
  try {
    const res = await pool.query(query);
    console.log('All Users:', res.rows);
  } catch (err) {
    console.error('Error fetching users:', err.stack);
  }
}

// Function to select all rows from the Venue table
async function getAllVenues() {
  const query = 'SELECT * FROM Venue';
  try {
    const res = await pool.query(query);
    console.log('All Venues:', res.rows);
  } catch (err) {
    console.error('Error fetching venues:', err.stack);
  }
}

// Function to select all rows from the Tour table
async function getAllTours() {
  const query = 'SELECT * FROM Tour';
  try {
    const res = await pool.query(query);
    console.log('All Tours:', res.rows);
  } catch (err) {
    console.error('Error fetching tours:', err.stack);
  }
}

// Function to select all rows from the Concert table
async function getAllConcerts() {
  const query = 'SELECT * FROM Concert';
  try {
    const res = await pool.query(query);
    console.log('All Concerts:', res.rows);
  } catch (err) {
    console.error('Error fetching concerts:', err.stack);
  }
}

// Function to select all rows from the Review table
async function getAllReviews() {
  const query = 'SELECT * FROM Review';
  try {
    const res = await pool.query(query);
    console.log('All Reviews:', res.rows);
  } catch (err) {
    console.error('Error fetching reviews:', err.stack);
  }
}

// Function to handle all queries sequentially
async function run() {
  try {
    await getAllArtists();
    await getAllUsers();
    await getAllVenues();
    await getAllTours();
    await getAllConcerts();
    await getAllReviews();
  } catch (err) {
    console.error('Error during query execution:', err.stack);
  } finally {
    // Release the pool resources
    await pool.end();
    console.log('Connection pool closed.');
  }
}

// Run the script
run();

