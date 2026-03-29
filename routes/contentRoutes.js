const express = require('express');
const contentController = require('../controllers/contentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: Fetch all site content
router.get('/', contentController.getAllContent);

// Admin Only: Update site content
router.put('/', protect, restrictTo('admin'), contentController.updateContent);

module.exports = router;
