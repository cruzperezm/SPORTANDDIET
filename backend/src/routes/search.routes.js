const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");

router.get("/suggestions", searchController.getSuggestions);
router.get("/basicSearch", searchController.basicSearch);
router.get("/filter", searchController.filter);

module.exports = router;
