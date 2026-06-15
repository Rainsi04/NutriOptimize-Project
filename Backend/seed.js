const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/Recipe');
const Disease = require('./models/Disease'); // NEW
const comprehensiveRecipes = require('./recipeDataset');
const diseaseData = require('./data/diseaseData'); // NEW

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nutrioptimize'); // Changed database name
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');
    
    await Disease.deleteMany({}); // NEW
    console.log('Cleared existing diseases');
    
    // Insert diseases first
    await Disease.insertMany(diseaseData); // NEW
    console.log(`Added ${diseaseData.length} diseases to database!`);
    
    // Insert comprehensive recipes
    await Recipe.insertMany(comprehensiveRecipes);
    console.log(`Added ${comprehensiveRecipes.length} comprehensive recipes to database!`);
    
    // Display sample of what was added
    console.log('\n=== SAMPLE OF ADDED DISEASES ===');
    const sampleDiseases = await Disease.find().limit(3);
    sampleDiseases.forEach(disease => {
      console.log(`- ${disease.name}`);
      console.log(`  Description: ${disease.description}`);
      console.log(`  Restrictions: ${disease.dietaryRestrictions.length} dietary rules`);
      console.log(`  Recommended: ${disease.recommendedFoods.slice(0, 3).join(', ')}`);
    });
    
    console.log('\n=== SAMPLE OF ADDED RECIPES ===');
    const sampleRecipes = await Recipe.find().limit(3);
    sampleRecipes.forEach(recipe => {
      console.log(`- ${recipe.title || recipe.name}`);
      console.log(`  Goals: ${recipe.healthGoals ? recipe.healthGoals.join(', ') : 'N/A'}`);
      console.log(`  Diet: ${recipe.dietType ? recipe.dietType.join(', ') : 'N/A'}`);
      console.log(`  Calories: ${recipe.nutrition?.calories || recipe.calories}, Protein: ${recipe.nutrition?.protein || recipe.protein}g`);
    });
    
    // Show recipe count by potential disease compatibility
    console.log('\n=== RECIPE COMPATIBILITY SUMMARY ===');
    const totalRecipes = await Recipe.countDocuments();
    console.log(`Total recipes in database: ${totalRecipes}`);
    
    // Count recipes that might be suitable for different conditions
    const lowFatRecipes = await Recipe.countDocuments({ 
      $or: [
        { 'nutrition.fat': { $lte: 15 } },
        { fat: { $lte: 15 } }
      ]
    });
    console.log(`Low-fat recipes (≤15g): ${lowFatRecipes}`);
    
    const lowSugarRecipes = await Recipe.countDocuments({
      $or: [
        { 'nutrition.sugar': { $lte: 15 } },
        { sugar: { $lte: 15 } }
      ]
    });
    console.log(`Low-sugar recipes (≤15g): ${lowSugarRecipes}`);
    
    const highFiberRecipes = await Recipe.countDocuments({
      $or: [
        { 'nutrition.fiber': { $gte: 5 } },
        { fiber: { $gte: 5 } }
      ]
    });
    console.log(`High-fiber recipes (≥5g): ${highFiberRecipes}`);
    
    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;