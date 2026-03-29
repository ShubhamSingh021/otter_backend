const express = require('express');
const galleryController = require('../controllers/galleryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { upload } = require('../services/cloudinary');

const router = express.Router();

// Public: Fetch gallery items
router.get('/', galleryController.getGallery);

// Admin Only: Manage items
router.use(protect, restrictTo('admin'));

router.post('/', upload.single('media'), galleryController.uploadToGallery);
router.patch('/:id', galleryController.toggleVisibility);
router.delete('/:id', galleryController.deleteItem);

module.exports = router;
