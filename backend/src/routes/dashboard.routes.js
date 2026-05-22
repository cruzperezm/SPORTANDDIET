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
router.post("/upsert", authenticateToken, dashboardController.upsertDashboard);
router.post(
  "/dieta/favorito",
  authenticateToken,
  dashboardController.addFavoriteRecipe,
);
router.post(
  "/deporte/favorito",
  authenticateToken,
  dashboardController.addFavoriteExercise,
);
// Añade esto en tu archivo de rutas
router.post('/favoritos/receta/remove', dashboardController.removeFavoriteRecipe);
router.post('/favoritos/ejercicio/remove', dashboardController.removeFavoriteExercise);
module.exports = router;
