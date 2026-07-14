const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Number,
    required: true,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastWatched: {
    type: Date,
    default: Date.now
  }
});

// Ensure one progress entry per user per video
progressSchema.index({ videoId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
