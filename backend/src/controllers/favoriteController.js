const favoriteService = require('../services/favoriteService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/apiResponse');

const addFavorite = catchAsync(async (req, res) => {
  const favorite = await favoriteService.addFavorite(req.user.id, req.params.labId);
  sendResponse(res, 201, { favorite }, 'Lab saved successfully');
});

const removeFavorite = catchAsync(async (req, res) => {
  const result = await favoriteService.removeFavorite(req.user.id, req.params.labId);
  sendResponse(res, 200, null, result.message);
});

const listFavorites = catchAsync(async (req, res) => {
  const favorites = await favoriteService.listFavorites(req.user.id);
  sendResponse(res, 200, { favorites });
});

module.exports = { addFavorite, removeFavorite, listFavorites };
