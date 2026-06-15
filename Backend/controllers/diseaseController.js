const Disease = require('../models/Disease');
const Recipe = require('../models/Recipe');

exports.getRecipesByDisease = async (req, res) => {
    try {
        const diseaseName = req.params.diseaseName;
        console.log('🔍 Searching recipes for disease:', diseaseName);
        
        // Map disease names to search terms in recipe tags/healthGoals
        const diseaseSearchTerms = {
            'Diabetes': ['diabetes-friendly', 'low-sugar', 'blood sugar', 'diabetes'],
            'Heart Disease': ['heart-healthy', 'heart-health', 'low-cholesterol', 'heart disease'],
            'Fatty Liver': ['liver-health', 'low-fat', 'detox', 'fatty liver'],
            'Kidney Disease': ['kidney-health', 'low-sodium', 'renal', 'kidney'],
            'Hypertension': ['low-sodium', 'blood pressure', 'heart-healthy', 'hypertension'],
            'PCOD/PCOS': ['hormonal-balance', 'low-carb', 'anti-inflammatory', 'pcod', 'pcos']
        };

        const searchTerms = diseaseSearchTerms[diseaseName] || [diseaseName.toLowerCase()];
        
        console.log('📝 Search terms:', searchTerms);

        // Search directly in recipes without checking diseases collection
        const recipes = await Recipe.find({
            $or: [
                { tags: { $in: searchTerms } },
                { healthGoals: { $in: searchTerms } },
                { title: { $regex: searchTerms.join('|'), $options: 'i' } },
                { description: { $regex: searchTerms.join('|'), $options: 'i' } }
            ]
        });
        
        console.log(`📊 Found ${recipes.length} recipes for ${diseaseName}`);
        
        if (recipes.length === 0) {
            // Fallback: Show some recipes based on nutritional criteria
            console.log('🔄 Using nutritional fallback for:', diseaseName);
            const fallbackRecipes = await getFallbackRecipes(diseaseName);
            return res.json(fallbackRecipes);
        }
        
        res.json(recipes);
    } catch (error) {
        console.error('❌ Error in getRecipesByDisease:', error);
        res.status(500).json({ message: error.message });
    }
};

// Helper function for fallback recipes based on nutritional needs
async function getFallbackRecipes(diseaseName) {
    const nutritionalCriteria = {
        'Diabetes': { $or: [{'nutrition.carbs': { $lte: 35 }}, {'nutrition.sugar': { $lte: 15 }}] },
        'Heart Disease': { $or: [{'nutrition.fat': { $lte: 15 }}, {'nutrition.fiber': { $gte: 7 }}] },
        'Fatty Liver': { $or: [{'nutrition.fat': { $lte: 15 }}, {'nutrition.fiber': { $gte: 8 }}] },
        'Hypertension': { 'nutrition.sodium': { $lte: 400 } },
        'Kidney Disease': { $or: [{'nutrition.protein': { $lte: 20 }}, {'nutrition.sodium': { $lte: 350 }}] },
        'PCOD/PCOS': { $or: [{'nutrition.carbs': { $lte: 25 }}, {'nutrition.sugar': { $lte: 12 }}] }
    };
    
    const criteria = nutritionalCriteria[diseaseName] || {};
    const fallbackRecipes = await Recipe.find(criteria).limit(6);
    console.log(`🔄 Fallback found ${fallbackRecipes.length} recipes for ${diseaseName}`);
    return fallbackRecipes;
}

exports.getAllDiseases = async (req, res) => {
    try {
        const diseases = await Disease.find();
        res.json(diseases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};