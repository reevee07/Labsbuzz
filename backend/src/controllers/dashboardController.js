const dashboardService = require('../services/dashboardService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/apiResponse');

const getLabOwnerDashboard = catchAsync(async (req, res) => {
  const stats = await dashboardService.getLabOwnerStats(req.user.id);
  sendResponse(res, 200, stats);
});

const getCustomerDashboard = catchAsync(async (req, res) => {
  const stats = await dashboardService.getCustomerStats(req.user.id);
  sendResponse(res, 200, { stats });
});

module.exports = { getLabOwnerDashboard, getCustomerDashboard };
