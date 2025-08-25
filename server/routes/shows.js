const express = require('express');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// Get all shows
router.get('/', async (req, res) => {
  try {
    const { movieId, theaterId, date } = req.query;
    let query = {};

    if (movieId) {
      query.movie = movieId;
    }

    if (theaterId) {
      query.theater = theaterId;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const shows = await Show.find(query)
      .populate('movie', 'title poster')
      .populate('theater', 'name location')
      .sort({ date: 1, time: 1 });

    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get show by ID
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title poster description duration genre')
      .populate('theater', 'name location address');
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    res.json(show);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new show (Admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { movieId, theaterId, screenNumber, date, time, price, totalSeats } = req.body;

    // Validate movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Validate theater exists
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    // Check if screen exists in the theater
    const screenExists = theater.screens.some(screen => screen.name === screenNumber);
    if (!screenExists) {
      return res.status(400).json({ message: 'Invalid screen for this theater' });
    }

    const show = new Show({
      movie: movieId,
      theater: theaterId,
      screen: screenNumber,
      date,
      time,
      price,
      totalSeats,
      availableSeats: totalSeats
    });

    await show.save();
    
    const populatedShow = await Show.findById(show._id)
      .populate('movie', 'title poster')
      .populate('theater', 'name location');

    res.status(201).json(populatedShow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update show (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { movieId, theaterId, screenNumber, date, time, price, totalSeats } = req.body;

    // Validate movie exists
    if (movieId) {
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
    }

    // Validate theater exists
    if (theaterId) {
      const theater = await Theater.findById(theaterId);
      if (!theater) {
        return res.status(404).json({ message: 'Theater not found' });
      }

      // Check if screen exists in the theater
      if (screenNumber) {
        const screenExists = theater.screens.some(screen => screen.name === screenNumber);
        if (!screenExists) {
          return res.status(400).json({ message: 'Invalid screen for this theater' });
        }
      }
    }

    // Transform the data to match the schema
    const updateData = { ...req.body };
    if (movieId) updateData.movie = movieId;
    if (theaterId) updateData.theater = theaterId;
    if (screenNumber) updateData.screen = screenNumber;
    delete updateData.movieId;
    delete updateData.theaterId;
    delete updateData.screenNumber;

    const show = await Show.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('movie', 'title poster')
     .populate('theater', 'name location');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json(show);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete show (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 