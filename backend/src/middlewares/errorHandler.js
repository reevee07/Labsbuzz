const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

/* eslint-disable no-unused-vars */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    error = new ApiError(statusCode, error.message || 'Internal server error', null, false);
  }

  if (!error.isOperational) {
    logger.error(err.stack || err.message);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${error.statusCode} ${error.message}`);
  }

  const response = {
    success: false,
    message: error.message || 'Something went wrong',
    ...(error.details ? { details: error.details } : {}),
    ...(env.NODE_ENV === 'development' && !error.isOperational ? { stack: err.stack } : {}),
  };

  res.status(error.statusCode || 500).json(response);
};

module.exports = { errorHandler, notFoundHandler };
