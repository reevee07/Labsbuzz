const express = require('express');
const searchController = require('../controllers/searchController');
const validate = require('../middlewares/validate');
const { searchQuerySchema } = require('../schemas/testSchemas');

const router = express.Router();

router.get('/', validate(searchQuerySchema, 'query'), searchController.search);

module.exports = router;
