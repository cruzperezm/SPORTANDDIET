const searchService = require("../services/search.service");

const getSuggestions = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const type = req.query.type;

    if (!searchQuery) return res.status(200).json([]); // Return empty if no query

    const results = await searchService.getSuggestions(searchQuery, type);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Suggestions failed" });
  }
};

const basicSearch = async (req, res) => {
  try {
    const searchQuery = req.query.searchString;
    const type = req.query.type;

    if (!searchQuery) return res.status(400).json([]);

    const results = await searchService.basicSearch(searchQuery, type);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Search failed" });
  }
};

const filter = async (req, res) => {
  try {
    // Expected format: ?tags=vegan,keto
    const tags = req.query.tags ? req.query.tags.split(",") : [];
    const type = req.query.type;
    const dietId = parseInt(req.query.dietId);
    const planId = parseInt(req.query.planId);

    const id = !isNaN(dietId) ? dietId : planId;

    console.log("This is the id:", id);
    const classification = req.query.classification.toUpperCase();

    const results = await searchService.filter(id, tags, type, classification);
    res.status(200).json(results);
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: "Filter search failed" });
  }
};

module.exports = { basicSearch, getSuggestions, filter };
