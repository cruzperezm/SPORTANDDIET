const express = require("express");
const router = express.Router();
const planController = require("../controllers/plan.controller");
const authenticateToken = require("../middleware/auth.middleware");

router.get("/dieta", authenticateToken, planController.getRecipesByMoment);
router.get("/deporte", authenticateToken, planController.getExercisesByLevel);

module.exports = router;
