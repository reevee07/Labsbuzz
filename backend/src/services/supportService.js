// backend/src/services/supportService.js
const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');

const createSupportRequest = async ({ name, email, subject, message }) => {
  const { data, error } = await supabaseAdmin
    .from('support_requests')
    .insert({ name, email, subject, message })
    .select('id, name, email, subject, message, status, created_at')
    .single();

  if (error) throw ApiError.internal(error.message);

  // TODO: once Brevo is wired up, trigger a confirmation email to the
  // user + an internal notification email here.
  return data;
};

module.exports = { createSupportRequest };