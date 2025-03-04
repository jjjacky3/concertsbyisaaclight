const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const indexroute = require("./routes/index");
const authRoutes = require("./routes/auth");
const concertRoutes = require("./routes/concerts");
const pool = require('./db'); // Add this line to import PostgreSQL pool

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.set("view engine", "ejs");

// Updated body-parser configuration with increased limits
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Routes
app.use("/", indexroute);
app.use("/api/auth", authRoutes);
app.use("/api/concerts", concertRoutes);

// MongoDB connection
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});