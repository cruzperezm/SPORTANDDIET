const sportService = require("../services/sport.service");

const getAllPlans = async (req, res) => {
  try {
    const results = await sportService.getAllPlans();
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Fetch of all plans failed" });
  }
};

const getPlanById = async (req, res) => {
  try {
    const planId = parseInt(req.query.id);

    const results = await sportService.getPlanById(planId);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Fetch of plan by ID failed" });
  }
};

const getExerciseById = async (req, res) => {
  try {
    const exerciseId = parseInt(req.query.id);

    const results = await sportService.getExerciseById(exerciseId);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Fetch of exercise by ID failed" });
  }
};

const getExercisesByLevel = async (req, res) => {
  try {
    const planId = parseInt(req.query.planId);
    const level = req.query.level.toUpperCase();

    if (
      level !== "PRINCIPIANTE" &&
      level !== "INTERMEDIO" &&
      level !== "AVANZADOS"
    )
      res.status(400);

    const results = await sportService.getExercisesByLevel(planId, level);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Fetch of exercises by level failed" });
  }
};

module.exports = {
  getAllPlans,
  getExerciseById,
  getExercisesByLevel,
  getPlanById,
};
