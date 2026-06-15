const express = require('express');
const router = express.Router();
const recipes = require('../recipeDataset');  

// GET all recipes
router.get('/', (req, res) => {
  res.json(recipes);
});

// GET recipe by _id
router.get('/:id', (req, res) => {
  const r = recipes.find(x => String(x._id) === String(req.params.id));
  if (!r) return res.status(404).json({ message: "Recipe not found" });
  res.json(r);
});

module.exports = router;
