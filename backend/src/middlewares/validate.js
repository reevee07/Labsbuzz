const ApiError = require('../utils/ApiError');

/**
 * Generic Zod validation middleware factory.
 * Usage: validate(schema, 'body' | 'query' | 'params')
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return next(ApiError.badRequest('Validation failed', details));
  }
  req[source] = result.data;
  next();
};

module.exports = validate;
