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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging middleware
app.use(morgan('combined'));

// Body parser configuration
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

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
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
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