const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.post('/search', searchController.search);
router.post('/filter', searchController.filter)

module.exports = router;