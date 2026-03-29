const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// PROTECT ALL ROUTES
// router.use(authMiddleware.protect);
// router.use(authMiddleware.restrictTo('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/members', adminController.getAllMembers);
router.patch('/members/:id', adminController.updateMemberStatus);
router.patch('/members/bulk/update', adminController.bulkUpdateStatus);

module.exports = router;
