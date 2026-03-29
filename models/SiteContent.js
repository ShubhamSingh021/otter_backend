const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: [true, 'Please provide a section name (e.g., hero, story)'],
    trim: true,
  },
  key: {
    type: String,
    required: [true, 'Please provide a key (e.g., title, subtitle)'],
    trim: true,
  },
  value: {
    type: String,
    required: [true, 'Please provide a value'],
    trim: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Optimization: Index for faster fetching by section/key
siteContentSchema.index({ section: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
