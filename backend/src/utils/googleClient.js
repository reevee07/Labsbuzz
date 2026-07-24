// backend/src/utils/googleClient.js
const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');
const ApiError = require('./ApiError');

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

/**
 * Verifies a Google ID token (JWT credential from the frontend GIS button)
 * and returns its payload: { sub, email, email_verified, name, picture }.
 */
const verifyGoogleIdToken = async (idToken) => {
  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired Google credential');
  }

  const payload = ticket.getPayload();
  if (!payload?.sub || !payload?.email) {
    throw ApiError.unauthorized('Google account did not return required profile info');
  }
  if (payload.email_verified === false) {
    throw ApiError.unauthorized('Google email is not verified');
  }
  return payload;
};

module.exports = { verifyGoogleIdToken };