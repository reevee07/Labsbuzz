const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const PUBLIC_USER_FIELDS =
  'id, role, name, phone, email, avatar_url, created_at';

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password_hash, reset_token_hash, reset_token_expires, ...rest } = user;
  return rest;
};

const buildTokens = (user) => {
  const payload = { id: user.id, role: user.role, email: user.email };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

const register = async ({ name, email, phone, password, role }) => {
  const { data: existing, error: findErr } = await supabaseAdmin
    .from('users')
    .select('id')
    .or(`email.eq.${email},phone.eq.${phone}`)
    .maybeSingle();

  if (findErr) throw ApiError.internal(findErr.message);
  if (existing) throw ApiError.conflict('An account with this email or phone already exists');

  const password_hash = await bcrypt.hash(password, 12);

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .insert({ name, email, phone, password_hash, role })
    .select(PUBLIC_USER_FIELDS)
    .single();

  if (error) throw ApiError.internal(error.message);

  // If registering as a lab_owner, we don't auto-create the lab profile here;
  // that happens explicitly in POST /labs (labController) after onboarding.
  const tokens = buildTokens(user);
  return { user, ...tokens };
};

const login = async ({ email, password }) => {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, role, name, phone, email, avatar_url, password_hash, created_at')
    .eq('email', email)
    .maybeSingle();

  if (error) throw ApiError.internal(error.message);
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

  const tokens = buildTokens(user);
  return { user: sanitizeUser(user), ...tokens };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) throw ApiError.unauthorized('Refresh token missing');

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select(PUBLIC_USER_FIELDS)
    .eq('id', decoded.id)
    .maybeSingle();

  if (error) throw ApiError.internal(error.message);
  if (!user) throw ApiError.unauthorized('User no longer exists');

  const tokens = buildTokens(user);
  return { user, ...tokens };
};

const forgotPassword = async (email) => {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, email')
    .eq('email', email)
    .maybeSingle();

  if (error) throw ApiError.internal(error.message);

  // Always respond success to avoid user enumeration, but only proceed if user exists.
  if (!user) return { message: 'If the email exists, a reset link has been sent.' };

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min

  const { error: updateErr } = await supabaseAdmin
    .from('users')
    .update({ reset_token_hash: tokenHash, reset_token_expires: expires })
    .eq('id', user.id);

  if (updateErr) throw ApiError.internal(updateErr.message);

  // In production this would be sent via email/SMS provider (SES/Twilio/etc.)
  // For now we return it so the flow is testable end-to-end during development.
  return {
    message: 'If the email exists, a reset link has been sent.',
    resetToken: rawToken,
  };
};

const resetPassword = async (token, newPassword) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, reset_token_expires')
    .eq('reset_token_hash', tokenHash)
    .maybeSingle();

  if (error) throw ApiError.internal(error.message);
  if (!user) throw ApiError.badRequest('Invalid or expired reset token');
  if (new Date(user.reset_token_expires) < new Date()) {
    throw ApiError.badRequest('Reset token has expired');
  }

  const password_hash = await bcrypt.hash(newPassword, 12);

  const { error: updateErr } = await supabaseAdmin
    .from('users')
    .update({ password_hash, reset_token_hash: null, reset_token_expires: null })
    .eq('id', user.id);

  if (updateErr) throw ApiError.internal(updateErr.message);

  return { message: 'Password has been reset successfully' };
};

const getProfile = async (userId) => {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select(PUBLIC_USER_FIELDS)
    .eq('id', userId)
    .maybeSingle();

  if (error) throw ApiError.internal(error.message);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

const updateProfile = async (userId, updates) => {
  const allowed = ['name', 'phone', 'avatar_url'];
  const payload = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowed.includes(key))
  );

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update(payload)
    .eq('id', userId)
    .select(PUBLIC_USER_FIELDS)
    .single();

  if (error) throw ApiError.internal(error.message);
  return user;
};

module.exports = {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  sanitizeUser,
};
