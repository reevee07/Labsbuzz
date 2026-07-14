const reviewService = require('../services/reviewService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/apiResponse');

const addReview = catchAsync(async (req, res) => {
  const review = await reviewService.addReview(req.user.id, req.body);
  sendResponse(res, 201, { review }, 'Review submitted successfully');
});

const listLabReviews = catchAsync(async (req, res) => {
  const reviews = await reviewService.listLabReviews(req.params.labId);
  sendResponse(res, 200, { reviews });
});

module.exports = { addReview, listLabReviews };
