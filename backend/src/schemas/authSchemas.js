// backend/src/schemas/authSchemas.js
const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['customer', 'lab_owner']).default('customer'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(10, 'Invalid or missing reset token'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10).optional(),
});

const googleAuthSchema = z.object({
  credential: z.string().min(20, 'Invalid Google credential'),
  role: z.enum(['customer', 'lab_owner']).optional().default('customer'),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  googleAuthSchema,
};