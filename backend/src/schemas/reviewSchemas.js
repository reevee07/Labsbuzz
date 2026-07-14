const { z } = require('zod');

const createReviewSchema = z.object({
  lab_id: z.string().uuid('Invalid lab id'),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().max(1000).optional().nullable(),
});

module.exports = { createReviewSchema };
