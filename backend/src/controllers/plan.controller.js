const planService = require("../services/plan.service");

const getExercisesByLevel = async (req, res) => {
  try {
    const userId = req.user.userId;
    const results = await planService.getExercisesByLevel(userId);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res
      .status(500)
      .json({ error: "Fetch of exercises in the personal plan failed" });
  }
};

const getRecipesByMoment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const results = await planService.getRecipesByMoment(userId);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res
      .status(500)
      .json({ error: "Fetch of recipes in the personal plan failed" });
  }
};

module.exports = { getExercisesByLevel, getRecipesByMoment };
