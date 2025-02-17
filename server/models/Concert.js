// models/Concert.js
const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  artist: {
    type: String,
    required: true,
    trim: true
  },
  tourName: {
    type: String,
    required: true,
    trim: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
concertSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Concert = mongoose.model('Concert', concertSchema);

module.exports = Concert;