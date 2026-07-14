const express = require('express');
const labController = require('../controllers/labController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { createLabSchema, updateLabSchema, nearbyQuerySchema } = require('../schemas/labSchemas');

const router = express.Router();

router.get('/nearby', validate(nearbyQuerySchema, 'query'), labController.listNearbyLabs);
router.get('/me', authenticate, authorize('lab_owner'), labController.getMyLab);
router.get('/:id', labController.getLabById);

router.post(
  '/',
  authenticate,
  authorize('lab_owner'),
  validate(createLabSchema),
  labController.createLab
);

router.patch(
  '/me',
  authenticate,
  authorize('lab_owner'),
  validate(updateLabSchema),
  labController.updateMyLab
);

module.exports = router;
