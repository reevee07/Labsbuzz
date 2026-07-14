const { z } = require('zod');

const createLabSchema = z.object({
  name: z.string().min(2).max(150),
  address: z.string().min(5).max(300),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  logo_url: z.string().url().optional().nullable(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  nabl_certified: z.boolean().optional().default(false),
  opens_at: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  closes_at: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
});

const updateLabSchema = createLabSchema.partial();

const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().max(100).optional().default(25),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

module.exports = { createLabSchema, updateLabSchema, nearbyQuerySchema };
