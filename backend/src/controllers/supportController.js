// backend/src/controllers/supportController.js
const supportService = require('../services/supportService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/apiResponse');

const submitSupportRequest = catchAsync(async (req, res) => {
  const request = await supportService.createSupportRequest(req.body);
  sendResponse(
    res,
    201,
    { request },
    "Thanks for reaching out — we'll get back to you within 24 hours."
  );
});

module.exports = { submitSupportRequest };