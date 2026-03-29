const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide a media URL'],
  },
  caption: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optimization: Index for ordering and active filter
gallerySchema.index({ order: 1, isActive: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);
