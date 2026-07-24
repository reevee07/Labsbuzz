// backend/src/controllers/authController.js
const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/apiResponse');
const { setRefreshCookie, clearRefreshCookie } = require('../utils/cookies');

const register = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  setRefreshCookie(res, refreshToken);
  sendResponse(res, 201, { user, accessToken }, 'Account created successfully');
});

const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setRefreshCookie(res, refreshToken);
  sendResponse(res, 200, { user, accessToken }, 'Logged in successfully');
});

const googleAuth = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.googleAuth(
    req.body.credential,
    req.body.role
  );
  setRefreshCookie(res, refreshToken);
  sendResponse(res, 200, { user, accessToken }, 'Signed in with Google successfully');
});

const refresh = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  const { user, accessToken, refreshToken } = await authService.refresh(token);
  setRefreshCookie(res, refreshToken);
  sendResponse(res, 200, { user, accessToken }, 'Token refreshed');
});

const logout = catchAsync(async (req, res) => {
  clearRefreshCookie(res);
  sendResponse(res, 200, null, 'Logged out successfully');
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  sendResponse(res, 200, result, result.message);
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await authService.resetPassword(req.body.token, req.body.password);
  sendResponse(res, 200, null, result.message);
});

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  sendResponse(res, 200, { user });
});

const updateMe = catchAsync(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  sendResponse(res, 200, { user }, 'Profile updated successfully');
});

module.exports = {
  register,
  login,
  googleAuth,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
};