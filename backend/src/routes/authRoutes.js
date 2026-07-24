// backend/src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/authenticate');
const { authLimiter } = require('../middlewares/rateLimiter');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
} = require('../schemas/authSchemas');

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/google', authLimiter, validate(googleAuthSchema), authController.googleAuth);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.get('/me', authenticate, authController.getMe);
router.patch('/me', authenticate, authController.updateMe);

module.exports = router;