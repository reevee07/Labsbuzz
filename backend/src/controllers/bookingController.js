const bookingService = require('../services/bookingService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/apiResponse');

const createBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.createBooking(req.user.id, req.body);
  sendResponse(res, 201, { booking }, 'Booking confirmed successfully');
});

const listMyBookings = catchAsync(async (req, res) => {
  const { bookings, meta } = await bookingService.listMyBookings(req.user.id, req.query);
  sendResponse(res, 200, { bookings, meta });
});

const listLabBookings = catchAsync(async (req, res) => {
  const { bookings, meta } = await bookingService.listLabBookings(req.user.id, req.query);
  sendResponse(res, 200, { bookings, meta });
});

const updateBookingStatus = catchAsync(async (req, res) => {
  const booking = await bookingService.updateBookingStatus(
    req.user.id,
    req.params.id,
    req.body.status
  );
  sendResponse(res, 200, { booking }, 'Booking status updated');
});

const cancelMyBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.cancelMyBooking(req.user.id, req.params.id);
  sendResponse(res, 200, { booking }, 'Booking cancelled successfully');
});

module.exports = {
  createBooking,
  listMyBookings,
  listLabBookings,
  updateBookingStatus,
  cancelMyBooking,
};
