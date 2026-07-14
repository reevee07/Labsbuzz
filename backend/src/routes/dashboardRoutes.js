const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.use(authenticate);

router.get('/lab-owner', authorize('lab_owner'), dashboardController.getLabOwnerDashboard);
router.get('/customer', authorize('customer'), dashboardController.getCustomerDashboard);

module.exports = router;
