const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');

// Get all diseases
router.get('/', diseaseController.getAllDiseases);

// Get recipes for a specific disease
router.get('/:diseaseName/recipes', diseaseController.getRecipesByDisease);


module.exports = router;