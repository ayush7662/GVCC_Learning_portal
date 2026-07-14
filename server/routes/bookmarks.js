const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/auth');

// Create bookmark
router.post('/', auth, async (req, res) => {
  try {
    const { name, timestamp, videoId } = req.body;
    
    if (!timestamp || !videoId) {
      return res.status(400).json({ message: 'Timestamp and videoId are required' });
    }
    
    const bookmark = new Bookmark({
      name: name || 'Bookmark',
      timestamp,
      videoId,
      userId: req.user.userId
    });
    
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get bookmarks for a video
router.get('/:videoId', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      videoId: req.params.videoId,
      userId: req.user.userId
    }).sort({ createdAt: -1 });
    
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update bookmark
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, timestamp } = req.body;
    
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, timestamp },
      { new: true }
    );
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete bookmark
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
