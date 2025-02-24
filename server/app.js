const express = require("express");
const pool = require('./db'); // connect to psql
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const indexroute = require("./server/routes/index");

const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "http://localhost:5173", // Allow only this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", indexroute);

async function getAllArtists() {
    try {
        const result = await pool.query('SELECT * FROM artist;');
        console.log('Artists:', result.rows);
    } catch (err) {
        console.error('Error fetching artists:', err);
    } finally {
        pool.end(); // Close the database connection
    }
}

getAllArtists();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
