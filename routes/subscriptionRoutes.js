const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// NEWSLETTER SUBSCRIPTION
router.post('/subscribe', subscriptionController.subscribe);

module.exports = router;
