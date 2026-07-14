const labTestService = require('../services/labTestService');
const testService = require('../services/testService');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/apiResponse');

const addTest = catchAsync(async (req, res) => {
  const labTest = await labTestService.addLabTest(req.user.id, req.body);
  sendResponse(res, 201, { labTest }, 'Test added successfully');
});

const listMyTests = catchAsync(async (req, res) => {
  const tests = await labTestService.listLabTests(req.user.id);
  sendResponse(res, 200, { tests });
});

const updateTest = catchAsync(async (req, res) => {
  const labTest = await labTestService.updateLabTest(req.user.id, req.params.id, req.body);
  sendResponse(res, 200, { labTest }, 'Test updated successfully');
});

const deleteTest = catchAsync(async (req, res) => {
  const result = await labTestService.deleteLabTest(req.user.id, req.params.id);
  sendResponse(res, 200, null, result.message);
});

const listCategories = catchAsync(async (req, res) => {
  const categories = await testService.listTestCategories();
  sendResponse(res, 200, { categories });
});

const searchCatalogue = catchAsync(async (req, res) => {
  const query = req.query.q || '';
  const tests = await testService.searchTestCatalogue(query);
  sendResponse(res, 200, { tests });
});

module.exports = { addTest, listMyTests, updateTest, deleteTest, listCategories, searchCatalogue };
