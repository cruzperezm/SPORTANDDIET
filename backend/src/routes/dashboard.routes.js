const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authenticateToken = require("../middleware/auth.middleware");

// GET dashboard endpoints
router.get("/dieta", authenticateToken, dashboardController.getDietaDashboard);
router.get(
  "/deporte",
  authenticateToken,
  dashboardController.getDeporteDashboard,
);

// POST upsert endpoint
router.post("/upsert", authenticateToken, dashboardController.upsertDashboard);

module.exports = router;
