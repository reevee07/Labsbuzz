const notificationService = require('../services/notificationService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/apiResponse');

const listNotifications = catchAsync(async (req, res) => {
  const { notifications, meta } = await notificationService.listNotifications(
    req.user.id,
    req.query
  );
  sendResponse(res, 200, { notifications, meta });
});

const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.user.id, req.params.id);
  sendResponse(res, 200, { notification });
});

const markAllAsRead = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  sendResponse(res, 200, null, result.message);
});

module.exports = { listNotifications, markAsRead, markAllAsRead };
