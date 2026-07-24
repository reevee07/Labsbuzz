// backend/src/routes/supportRoutes.js
const express = require('express');
const supportController = require('../controllers/supportController');
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');
const { createSupportRequestSchema } = require('../schemas/supportSchemas');

const router = express.Router();

// Public — anyone can reach out, logged in or not.
// Reuses authLimiter's stricter rate limit to prevent spam/abuse.
router.post('/', authLimiter, validate(createSupportRequestSchema), supportController.submitSupportRequest);

module.exports = router;