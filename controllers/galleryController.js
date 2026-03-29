const Gallery = require('../models/Gallery');

// @desc    Get all active gallery items
// @route   GET /api/v1/gallery
// @access  Public
exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ status: 'success', data: { items } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Upload gallery item
// @route   POST /api/v1/gallery
// @access  Admin
exports.uploadToGallery = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    const newItem = await Gallery.create({
      url: req.file.path,
      caption: req.body.caption,
      type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
      order: req.body.order || 0,
    });

    res.status(201).json({ status: 'success', data: { item: newItem } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Toggle item visibility
// @route   PATCH /api/v1/gallery/:id
// @access  Admin
exports.toggleVisibility = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ status: 'fail', message: 'Not found' });

    item.isActive = !item.isActive;
    await item.save();

    res.status(200).json({ status: 'success', data: { item } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Delete item
// @route   DELETE /api/v1/gallery/:id
// @access  Admin
exports.deleteItem = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
