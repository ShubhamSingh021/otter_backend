const SiteContent = require('../models/SiteContent');

// @desc    Get all active content
// @route   GET /api/v1/content
// @access  Public
exports.getAllContent = async (req, res) => {
  try {
    const contents = await SiteContent.find();
    
    // Group by section for easier frontend consumption
    const grouped = contents.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = {};
      acc[item.section][item.key] = item.value;
      return acc;
    }, {});

    res.status(200).json({ status: 'success', data: { contents: grouped } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Update content
// @route   PUT /api/v1/content
// @access  Admin
exports.updateContent = async (req, res) => {
  try {
    const { section, key, value } = req.body;
    
    if (!section || !key || !value) {
      return res.status(400).json({ status: 'fail', message: 'Missing section, key, or value' });
    }

    const content = await SiteContent.findOneAndUpdate(
      { section, key },
      { value, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: { content } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
