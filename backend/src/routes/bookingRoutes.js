const express = require('express');
const bookingController = require('../controllers/bookingController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const {
  createBookingSchema,
  updateBookingStatusSchema,
  bookingQuerySchema,
} = require('../schemas/bookingSchemas');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('customer'), validate(createBookingSchema), bookingController.createBooking);

router.get(
  '/me',
  authorize('customer'),
  validate(bookingQuerySchema, 'query'),
  bookingController.listMyBookings
);

router.get(
  '/lab',
  authorize('lab_owner'),
  validate(bookingQuerySchema, 'query'),
  bookingController.listLabBookings
);

router.patch(
  '/:id/status',
  authorize('lab_owner'),
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus
);

router.patch('/:id/cancel', authorize('customer'), bookingController.cancelMyBooking);

module.exports = router;
