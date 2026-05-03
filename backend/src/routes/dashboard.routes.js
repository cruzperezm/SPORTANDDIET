const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

// GET dashboard endpoints
router.get('/dieta', dashboardController.getDietaDashboard);
router.get('/deporte', dashboardController.getDeporteDashboard);

// POST upsert endpoint
router.post('/upsert', dashboardController.upsertDashboard);

module.exports = router;