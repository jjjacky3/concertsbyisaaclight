const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cron = require('node-cron');
require("dotenv").config();
const bodyParser = require("body-parser");
const pool = require('./db');
const authRoutes = require("./routes/auth");
const postgresRoutes = require("./routes/postgres");
const concertService = require("./services/concertService");

const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting with more generous settings
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000 // limit each IP to 1000 requests per hour
});
app.use(limiter);

// Logging middleware
app.use(morgan('combined'));

// Body parser configuration with increased limits
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.json({ limit: '100mb' }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/postgres", postgresRoutes);

// Schedule concert sync every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Running scheduled concert sync...');
  try {
    await concertService.syncMockConcertsToDatabase();
    console.log('Concert sync completed successfully');
  } catch (error) {
    console.error('Scheduled concert sync failed:', error);
  }
});

// Initial sync on startup
(async () => {
  try {
    console.log('Running initial concert sync...');
    await concertService.syncMockConcertsToDatabase();
    console.log('Initial concert sync completed successfully');
  } catch (error) {
    console.error('Initial concert sync failed:', error);
  }
})();

// Test PostgreSQL connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0]);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'An error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server...');
  app.close(() => {
    console.log('HTTP server closed');
    pool.end(() => {
      console.log('PostgreSQL connection closed');
      process.exit(0);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});