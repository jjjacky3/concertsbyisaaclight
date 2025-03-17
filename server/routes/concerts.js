// routes/concerts.js
const express = require('express');
const router = express.Router();
const Concert = require('../models/Concert');
const concertService = require('../services/concertService');

// GET all concerts
router.get('/', async (req, res) => {
  try {
    const concerts = await Concert.find().sort({ date: 1 });
    res.json(concerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching concerts', error: error.message });
  }
});

// GET single concert by ID
router.get('/:id', async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }
    res.json(concert);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching concert', error: error.message });
  }
});

// POST new concert
router.post('/', async (req, res) => {
  try {
    const concert = new Concert(req.body);
    await concert.save();
    res.status(201).json(concert);
  } catch (error) {
    res.status(400).json({ message: 'Error creating concert', error: error.message });
  }
});

// PUT update concert
router.put('/:id', async (req, res) => {
  try {
    const concert = await Concert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }
    res.json(concert);
  } catch (error) {
    res.status(400).json({ message: 'Error updating concert', error: error.message });
  }
});

// DELETE concert
router.delete('/:id', async (req, res) => {
  try {
    const concert = await Concert.findByIdAndDelete(req.params.id);
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }
    res.json({ message: 'Concert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting concert', error: error.message });
  }
});

// Sync mock concerts to database
router.post('/sync', async (req, res) => {
    try {
        const result = await concertService.syncMockConcertsToDatabase();
        res.json(result);
    } catch (error) {
        console.error('Error syncing concerts:', error);
        res.status(500).json({ 
            message: 'Failed to sync concerts',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Search concerts with filters
router.get('/search', async (req, res) => {
    try {
        const params = {
            keyword: req.query.keyword,
            city: req.query.city,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            limit: parseInt(req.query.limit) || 20,
            offset: parseInt(req.query.offset) || 0
        };
        
        const concerts = await concertService.searchConcerts(params);
        res.json(concerts);
    } catch (error) {
        console.error('Error searching concerts:', error);
        res.status(500).json({ 
            message: 'Failed to search concerts',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;