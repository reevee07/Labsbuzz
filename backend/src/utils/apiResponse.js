/**
 * Consistent success response envelope across all endpoints.
 */
const sendResponse = (res, statusCode, data, message = 'Success', meta = undefined) => {
  const payload = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

module.exports = { sendResponse };
