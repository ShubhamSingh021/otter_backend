const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  fee: { type: Number, required: true },
  capacity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, enum: ['Cricket', 'Football', 'Badminton', 'Other'], default: 'Cricket' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
