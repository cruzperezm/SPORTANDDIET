const dietService = require("../services/diet.service");

const getAllDiets = async (req, res) => {
  try {
    const results = await dietService.getAllDiets();
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Fetch of all diets failed" });
  }
};

const getDietById = async (req, res) => {
  try {
    const dietId = parseInt(req.query.id);

    const results = await dietService.getDietById(dietId);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Fetch of diet by ID failed" });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipeId = parseInt(req.query.id);

    const results = await dietService.getRecipeById(recipeId);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Fetch of recipe by ID failed" });
  }
};

const getRecipesByMoment = async (req, res) => {
  try {
    const dietId = parseInt(req.query.dietId);
    const moment = req.query.moment.toUpperCase();

    if (moment !== "DESAYUNO" && moment !== "ALMUERZO" && moment !== "CENA")
      res.status(400);

    const results = await dietService.getRecipesByMoment(dietId, moment);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Fetch of breakfast recipes failed" });
  }
};

module.exports = {
  getAllDiets,
  getDietById,
  getRecipeById,
  getRecipesByMoment,
};
