const searchService = require('../services/searchService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/apiResponse');

const search = catchAsync(async (req, res) => {
  const { results, meta } = await searchService.searchLabTests(req.query);
  sendResponse(res, 200, { results, meta });
});

module.exports = { search };
