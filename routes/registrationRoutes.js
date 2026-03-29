const express = require('express');
const registrationController = require('../controllers/registrationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { upload } = require('../services/cloudinary');

const router = express.Router();

router.use(protect);

router.post('/', upload.single('paymentProof'), registrationController.createRegistration);
router.get('/my', registrationController.getMyRegistrations);

// Admin Routes for Registrations
router.get('/all', restrictTo('admin'), registrationController.getAllRegistrations);
router.patch('/bulk-update', restrictTo('admin'), registrationController.bulkUpdateRegistrations);

module.exports = router;
