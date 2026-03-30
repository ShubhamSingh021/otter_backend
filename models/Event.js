const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  fee: { type: Number }, // Maintain fee for backward compatibility
  capacity: { type: Number, default: 0 },
  imageUrl: { type: String, default: "" },
  type: { type: String, default: 'general' },
  createdAt: { type: Date, default: Date.now },
});

// Backward compatibility: map fee to price if price is not provided
eventSchema.pre('validate', function(next) {
  if (this.fee && !this.price) {
    this.price = this.fee;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
