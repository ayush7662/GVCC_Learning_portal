const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Save or update progress
router.post('/', auth, async (req, res) => {
  try {
    const { videoId, timestamp } = req.body;
    
    if (!videoId || timestamp === undefined) {
      return res.status(400).json({ message: 'VideoId and timestamp are required' });
    }
    
    const progress = await Progress.findOneAndUpdate(
      { videoId, userId: req.user.userId },
      { timestamp, lastWatched: Date.now() },
      { upsert: true, new: true }
    );
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get progress for a video
router.get('/:videoId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      videoId: req.params.videoId,
      userId: req.user.userId
    });
    
    res.json(progress || { timestamp: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recently watched videos
router.get('/recent/all', auth, async (req, res) => {
  try {
    const recentProgress = await Progress.find({ userId: req.user.userId })
      .sort({ lastWatched: -1 })
      .limit(5)
      .populate('videoId');
    
    res.json(recentProgress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
