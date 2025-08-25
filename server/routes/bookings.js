const express = require('express');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { showId, seats, totalAmount, paymentMethod } = req.body;

    // Check if show exists and has available seats
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    if (show.availableSeats < seats.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Check if seats are already booked
    const bookedSeats = show.bookedSeats || [];
    const isSeatBooked = seats.some(seat => bookedSeats.includes(seat));
    if (isSeatBooked) {
      return res.status(400).json({ message: 'Some seats are already booked' });
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      show: showId,
      seats,
      totalAmount,
      paymentMethod
    });

    await booking.save();

    // Update show with booked seats
    show.bookedSeats = [...bookedSeats, ...seats];
    show.availableSeats = show.availableSeats - seats.length;
    await show.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('show')
      .populate({
        path: 'show',
        populate: {
          path: 'movieId',
          model: 'Movie'
        }
      })
      .populate({
        path: 'show',
        populate: {
          path: 'theaterId',
          model: 'Theater'
        }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('show')
      .populate({
        path: 'show',
        populate: {
          path: 'movieId',
          model: 'Movie'
        }
      })
      .populate({
        path: 'show',
        populate: {
          path: 'theaterId',
          model: 'Theater'
        }
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Update show availability
    const show = await Show.findById(booking.show);
    if (show) {
      show.availableSeats = show.availableSeats + booking.seats.length;
      show.bookedSeats = show.bookedSeats.filter(seat => !booking.seats.includes(seat));
      await show.save();
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings (Admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: [
          { path: 'movieId', select: 'title' },
          { path: 'theaterId', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (Admin only)
router.patch('/:id/status', [auth, admin], async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete booking (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 