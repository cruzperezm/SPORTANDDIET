const express = require("express");
const router = express.Router();
const dietController = require("../controllers/diet.controller");

router.get("/all", dietController.getAllDiets);
router.get("/", dietController.getDietById);
router.get("/recipes", dietController.getRecipeById);
router.get("/recipes/moment", dietController.getRecipesByMoment);

module.exports = router;
