const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/profile.controller');

router.put('/profile', updateProfile);
router.get('/profile', getProfile);

module.exports = router;