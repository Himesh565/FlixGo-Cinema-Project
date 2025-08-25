const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  screens: [{
    name: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    seats: {
      type: [[String]],
      default: []
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Theater', theaterSchema); 