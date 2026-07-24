// backend/src/routes/index.js
const express = require('express');

const authRoutes = require('./authRoutes');
const labRoutes = require('./labRoutes');
const testRoutes = require('./testRoutes');
const searchRoutes = require('./searchRoutes');
const bookingRoutes = require('./bookingRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const reviewRoutes = require('./reviewRoutes');
const notificationRoutes = require('./notificationRoutes');
const supportRoutes = require('./supportRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Labsbuzz API is healthy' });
});

router.use('/auth', authRoutes);
router.use('/labs', labRoutes);
router.use('/tests', testRoutes);
router.use('/search', searchRoutes);
router.use('/bookings', bookingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/support', supportRoutes);

module.exports = router;