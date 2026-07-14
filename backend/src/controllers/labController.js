const labService = require('../services/labService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/apiResponse');

const createLab = catchAsync(async (req, res) => {
  const lab = await labService.createLab(req.user.id, req.body);
  sendResponse(res, 201, { lab }, 'Lab registered successfully');
});

const getMyLab = catchAsync(async (req, res) => {
  const lab = await labService.getLabByOwner(req.user.id);
  sendResponse(res, 200, { lab });
});

const updateMyLab = catchAsync(async (req, res) => {
  const existing = await labService.getLabByOwner(req.user.id);
  const lab = await labService.updateLab(req.user.id, existing.id, req.body);
  sendResponse(res, 200, { lab }, 'Lab details updated successfully');
});

const getLabById = catchAsync(async (req, res) => {
  const { lat, lng } = req.query;
  const lab = await labService.getLabById(
    req.params.id,
    lat !== undefined ? Number(lat) : undefined,
    lng !== undefined ? Number(lng) : undefined
  );
  sendResponse(res, 200, { lab });
});

const listNearbyLabs = catchAsync(async (req, res) => {
  const { labs, meta } = await labService.listNearbyLabs(req.query);
  sendResponse(res, 200, { labs, meta });
});

module.exports = { createLab, getMyLab, updateMyLab, getLabById, listNearbyLabs };
