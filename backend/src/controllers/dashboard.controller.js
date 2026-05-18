const DashboardService = require("../services/dashboard.service");

/**
 * GET /api/dashboard/dieta
 * Retrieve diet dashboard data
 */
exports.getDietaDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Recibido el userID:", userId);
    const data = await DashboardService.getDietaDashboard(userId);
    res.json(data);
  } catch (error) {
    console.error("GET dieta error:", error);
    res.status(404).json({ error: error.message || "Dashboard not found" });
  }
};

/**
 * GET /api/dashboard/deporte
 * Retrieve sport dashboard data
 */
exports.getDeporteDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await DashboardService.getDeporteDashboard(userId);
    res.json(data);
  } catch (error) {
    console.error("GET deporte error:", error);
    res.status(404).json({ error: error.message || "Dashboard not found" });
  }
};

/**
 * POST /api/dashboard/upsert
 * Create or update dashboard data
 */
exports.upsertDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { dieta, deporte } = req.body;

    const data = await DashboardService.upsertDashboard(userId, {
      ...(dieta && { dieta }),
      ...(deporte && { deporte }),
    });

    res.json({ message: "Dashboard updated successfully", data });
  } catch (error) {
    console.error("POST upsert error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

exports.addFavoriteRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.body.recipeId;

    if (!recipeId) return res.status(400).json({ error: "Falta el ID de la receta" });

    await DashboardService.addFavoriteRecipe(userId, recipeId);
    res.status(200).json({ message: "Receta añadida a tus Favoritos" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFavoriteExercise = async (req, res) => {
  try {
    const userId = req.user.userId;
    const exerciseId = req.body.exerciseId;

    if (!exerciseId) return res.status(400).json({ error: "Falta el ID del ejercicio" });

    await DashboardService.addFavoriteExercise(userId, exerciseId);
    res.status(200).json({ message: "Ejercicio añadido a tus Favoritos" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};