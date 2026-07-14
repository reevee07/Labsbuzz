const express = require('express');
const reviewController = require('../controllers/reviewController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { createReviewSchema } = require('../schemas/reviewSchemas');

const router = express.Router();

router.get('/lab/:labId', reviewController.listLabReviews);

router.post(
  '/',
  authenticate,
  authorize('customer'),
  validate(createReviewSchema),
  reviewController.addReview
);

module.exports = router;
