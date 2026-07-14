const { z } = require('zod');

const createTestSchema = z.object({
  test_name: z.string().min(2).max(150),
  category: z.string().min(2).max(100),
  description: z.string().max(1000).optional().nullable(),
});

const createLabTestSchema = z.object({
  test_id: z.string().uuid().optional(),
  test_name: z.string().min(2).max(150).optional(),
  category: z.string().min(2).max(100).optional(),
  price: z.coerce.number().positive(),
  discounted_price: z.coerce.number().positive().optional().nullable(),
  turnaround_time: z.string().min(1).max(50),
  home_collection: z.boolean().optional().default(false),
}).refine((data) => data.test_id || (data.test_name && data.category), {
  message: 'Provide either test_id or (test_name and category) to create a new test',
});

const updateLabTestSchema = z.object({
  price: z.coerce.number().positive().optional(),
  discounted_price: z.coerce.number().positive().optional().nullable(),
  turnaround_time: z.string().min(1).max(50).optional(),
  home_collection: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

const searchQuerySchema = z.object({
  q: z.string().min(1).max(150).optional(),
  category: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().max(100).optional().default(25),
  sortBy: z
    .enum(['price_low', 'price_high', 'distance', 'turnaround', 'rating'])
    .optional()
    .default('distance'),
  homeCollection: z.coerce.boolean().optional(),
  nablCertified: z.coerce.boolean().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

module.exports = {
  createTestSchema,
  createLabTestSchema,
  updateLabTestSchema,
  searchQuerySchema,
};
