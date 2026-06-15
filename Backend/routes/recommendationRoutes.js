// backend/routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// POST endpoint for personalized recommendations
router.post('/', async (req, res) => {
    try {
        const userData = req.body;
        console.log('Received user data for recommendations:', userData);

        // Get all recipes from database
        const allRecipes = await Recipe.find();
        
        // Score recipes based on user data
        const scoredRecipes = scoreRecipes(allRecipes, userData);
        
        // Get top recommendations
        const recommendedRecipes = scoredRecipes
            .filter(recipe => recipe.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 6); // Top 6 recipes

        console.log(`Returning ${recommendedRecipes.length} recommended recipes`);
        res.json(recommendedRecipes);

    } catch (error) {
        console.error('Error in recommendations:', error);
        res.status(500).json({ message: error.message });
    }
});

function scoreRecipes(recipes, userData) {
    return recipes.map(recipe => {
        let score = 50; // Base score
        
        // Score based on health conditions
        if (userData.diseases && userData.diseases.length > 0) {
            const healthScore = calculateHealthScore(recipe, userData.diseases);
            score += healthScore;
        }
        
        // Score based on goals
        const goalScore = calculateGoalScore(recipe, userData.goal);
        score += goalScore;
        
        // Score based on activity level
        const activityScore = calculateActivityScore(recipe, userData.activity);
        score += activityScore;
        
        // Score based on demographics
        const demographicScore = calculateDemographicScore(recipe, userData);
        score += demographicScore;
        
        // Penalize recipes with user restrictions
        if (hasRestrictedIngredients(recipe, userData.diseases || [])) {
            score -= 30;
        }
        
        return { ...recipe.toObject(), score: Math.max(0, Math.min(100, score)) };
    });
}

function calculateHealthScore(recipe, diseases) {
    let score = 0;
    const healthMapping = {
        'diabetes': { 
            good: ['diabetes-friendly', 'low-sugar', 'high-fiber'], 
            bad: ['high-sugar'] 
        },
        'heart': { 
            good: ['heart-healthy', 'low-sodium', 'low-fat'], 
            bad: ['high-sodium', 'high-fat'] 
        },
        'high blood pressure': { 
            good: ['low-sodium', 'heart-healthy'], 
            bad: ['high-sodium'] 
        }
    };
    
    diseases.forEach(disease => {
        const diseaseKey = Object.keys(healthMapping).find(key => 
            disease.toLowerCase().includes(key.toLowerCase())
        );
        
        if (diseaseKey) {
            const mapping = healthMapping[diseaseKey];
            // Check tags array
            mapping.good.forEach(tag => {
                if (recipe.tags && recipe.tags.includes(tag)) score += 10;
            });
            mapping.bad.forEach(tag => {
                if (recipe.tags && recipe.tags.includes(tag)) score -= 15;
            });
        }
    });
    
    return score;
}

function calculateGoalScore(recipe, goal) {
    const goalMapping = {
        'lose': ['weight-loss', 'low-calorie', 'high-fiber'],
        'gain': ['high-protein', 'calorie-dense', 'muscle-gain'],
        'muscle': ['high-protein', 'muscle-gain', 'energy'],
        'maintain': ['balanced', 'nutritious', 'heart-healthy']
    };
    
    const goalTags = goalMapping[goal] || [];
    let score = 0;
    
    if (recipe.tags) {
        goalTags.forEach(tag => {
            if (recipe.tags.includes(tag)) score += 8;
        });
    }
    
    // Also check healthGoals array
    if (recipe.healthGoals) {
        goalTags.forEach(tag => {
            if (recipe.healthGoals.includes(tag)) score += 5;
        });
    }
    
    return score;
}

function calculateActivityScore(recipe, activity) {
    const activityCalorieMapping = {
        'sedentary': { min: 200, max: 400 },
        'light': { min: 300, max: 500 },
        'moderate': { min: 400, max: 600 },
        'active': { min: 500, max: 700 },
        'very-active': { min: 600, max: 800 }
    };
    
    const range = activityCalorieMapping[activity] || { min: 400, max: 600 };
    const calories = recipe.nutrition?.calories || 400;
    
    if (calories >= range.min && calories <= range.max) return 10;
    if (calories < range.min - 100 || calories > range.max + 100) return -5;
    return 0;
}

function calculateDemographicScore(recipe, userData) {
    let score = 0;
    
    // Age-based scoring
    if (userData.age > 50 && recipe.tags && recipe.tags.includes('heart-healthy')) {
        score += 5;
    }
    
    // Gender-based preferences (simplified)
    if (userData.sex === 'male' && recipe.tags && recipe.tags.includes('muscle-gain')) {
        score += 3;
    }
    if (userData.sex === 'female' && recipe.tags && recipe.tags.includes('high-fiber')) {
        score += 3;
    }
    
    return score;
}

function hasRestrictedIngredients(recipe, diseases) {
    const restrictionMapping = {
        'diabetes': ['sugar', 'honey', 'maple syrup', 'agave'],
        'heart': ['saturated fat', 'butter', 'cream', 'red meat'],
        'celiac': ['wheat', 'gluten', 'barley', 'rye'],
        'dairy': ['milk', 'cheese', 'yogurt', 'butter']
    };
    
    const recipeText = JSON.stringify(recipe).toLowerCase();
    
    return diseases.some(disease => {
        const restrictions = restrictionMapping[disease.toLowerCase()];
        return restrictions && restrictions.some(restriction => 
            recipeText.includes(restriction.toLowerCase())
        );
    });
}

module.exports = router;