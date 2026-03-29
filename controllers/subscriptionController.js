const Subscription = require('../models/Subscription');

exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide an email address.'
      });
    }

    // Always check if subscription exists
    const existingSubscription = await Subscription.findOne({ email });

    if (existingSubscription) {
      // If already subscribed, return success to maintain UX, but don't duplicate
      return res.status(200).json({
        status: 'success',
        message: 'You have already subscribed to our newsletter!'
      });
    }

    // Create new subscription
    await Subscription.create({ email });

    res.status(201).json({
      status: 'success',
      message: 'Welcome to the club! You are now subscribed to our newsletter.'
    });

  } catch (err) {
    // If it's a validation error, return a clean message
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }

    // Forward to global error handler
    next(err);
  }
};
