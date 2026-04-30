const express = require("express");
const router = express.Router();
const sportController = require("../controllers/sport.controller");

router.get("/all", sportController.getAllPlans);
router.get("/", sportController.getPlanById);
router.get("/exercises", sportController.getExerciseById);
router.get("/exercises/level", sportController.getExercisesByLevel);

module.exports = router;
