const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const { authenticate } = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.use(authenticate, authorize('customer'));

router.get('/', favoriteController.listFavorites);
router.post('/:labId', favoriteController.addFavorite);
router.delete('/:labId', favoriteController.removeFavorite);

module.exports = router;
