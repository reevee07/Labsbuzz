const express = require('express');
const testController = require('../controllers/testController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { createLabTestSchema, updateLabTestSchema } = require('../schemas/testSchemas');

const router = express.Router();

router.get('/categories', testController.listCategories);
router.get('/catalogue', testController.searchCatalogue);

router.get('/me', authenticate, authorize('lab_owner'), testController.listMyTests);

router.post(
  '/',
  authenticate,
  authorize('lab_owner'),
  validate(createLabTestSchema),
  testController.addTest
);

router.patch(
  '/:id',
  authenticate,
  authorize('lab_owner'),
  validate(updateLabTestSchema),
  testController.updateTest
);

router.delete('/:id', authenticate, authorize('lab_owner'), testController.deleteTest);

module.exports = router;
