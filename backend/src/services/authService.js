// backend/src/services/authService.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { supabaseAdmin } = require('../config/supabaseClient');
const ApiError = require('../utils/ApiError');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { verifyGoogleIdToken } = require('../utils/googleClient');

const PUBLIC_USER_FIELDS =
  'id, role, name, phone, email, avatar_url, created_at';

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password_hash, reset_token_hash, reset_token_expires, google_id, ...rest } = user;
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

  if (!user.password_hash) {
    throw ApiError.unauthorized(
      'This account uses Google Sign-In. Please continue with Google instead.'
    );
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

  const tokens = buildTokens(user);
  return { user: sanitizeUser(user), ...tokens };
};

/**
 * Google sign-in / sign-up.
 * - If a user already has this google_id, log them in.
 * - Else if a user already exists with this email (password-based account),
 *   link the Google identity to it and log them in.
 * - Else create a brand-new account with the requested role.
 */
const googleAuth = async (credential, requestedRole = 'customer') => {
  const payload = await verifyGoogleIdToken(credential);

  let { data: user, error } = await supabaseAdmin
    .from('users')
    .select(PUBLIC_USER_FIELDS)
    .eq('google_id', payload.sub)
    .maybeSingle();
  if (error) throw ApiError.internal(error.message);

  if (!user) {
    const { data: existingByEmail, error: findErr } = await supabaseAdmin
      .from('users')
      .select(PUBLIC_USER_FIELDS)
      .eq('email', payload.email)
      .maybeSingle();
    if (findErr) throw ApiError.internal(findErr.message);

    if (existingByEmail) {
      const { data: linked, error: linkErr } = await supabaseAdmin
        .from('users')
        .update({
          google_id: payload.sub,
          avatar_url: existingByEmail.avatar_url || payload.picture || null,
        })
        .eq('id', existingByEmail.id)
        .select(PUBLIC_USER_FIELDS)
        .single();
      if (linkErr) throw ApiError.internal(linkErr.message);
      user = linked;
    } else {
      const { data: created, error: createErr } = await supabaseAdmin
        .from('users')
        .insert({
          name: payload.name || payload.email.split('@')[0],
          email: payload.email,
          phone: null,
          password_hash: null,
          role: requestedRole,
          avatar_url: payload.picture || null,
          google_id: payload.sub,
        })
        .select(PUBLIC_USER_FIELDS)
        .single();
      if (createErr) throw ApiError.internal(createErr.message);
      user = created;
    }
  }

  const tokens = buildTokens(user);
  return { user, ...tokens };
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
    .select('id, email, password_hash')
    .eq('email', email)
    .maybeSingle();

  if (error) throw ApiError.internal(error.message);
  if (!user) return { message: 'If the email exists, a reset link has been sent.' };

  if (!user.password_hash) {
    // Google-only account — nothing to reset. Still respond generically.
    return { message: 'If the email exists, a reset link has been sent.' };
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const { error: updateErr } = await supabaseAdmin
    .from('users')
    .update({ reset_token_hash: tokenHash, reset_token_expires: expires })
    .eq('id', user.id);

  if (updateErr) throw ApiError.internal(updateErr.message);

  return {
    message: 'If the email exists, a reset link has been sent.',
    resetToken: rawToken, // TODO: remove once Brevo sends this by email instead
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
  googleAuth,
  refresh,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  sanitizeUser,
};