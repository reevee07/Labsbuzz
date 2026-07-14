const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { verifyAccessToken } = require('../utils/jwt');

/**
 * Verifies the JWT access token from Authorization header (Bearer) or cookie.
 * Attaches decoded payload ({ id, role, email }) to req.user.
 */
const authenticate = catchAsync(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication token missing');
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }
});

/**
 * Optional auth - attaches req.user if a valid token is present,
 * but does not fail the request if absent/invalid.
 */
const optionalAuthenticate = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) return next();

  try {
    req.user = verifyAccessToken(token);
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
};

module.exports = { authenticate, optionalAuthenticate };
