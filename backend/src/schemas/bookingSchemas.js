const { z } = require('zod');

const createBookingSchema = z.object({
  lab_id: z.string().uuid('Invalid lab id'),
  lab_test_id: z.string().uuid('Invalid lab test id'),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  booking_time: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
  home_collection: z.boolean().optional().default(false),
  address: z.string().max(300).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
});

const bookingQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

module.exports = { createBookingSchema, updateBookingStatusSchema, bookingQuerySchema };
