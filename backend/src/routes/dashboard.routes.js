const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authenticateToken = require("../middleware/auth.middleware");

// GET dashboard endpoints
router.get("/dieta", authenticateToken, dashboardController.getDietaDashboard);
router.get("/deporte", authenticateToken, dashboardController.getDeporteDashboard);

// POST upsert endpoint
router.post("/upsert", authenticateToken, dashboardController.upsertDashboard);
// Añade esto donde tengas definidas tus rutas del dashboard
router.post("/dieta/favorito", authenticateToken, dashboardController.addFavoriteRecipe);
router.post("/deporte/favorito", authenticateToken, dashboardController.addFavoriteExercise);
module.exports = router;
