const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  ingredients: [{
    name: String,
    quantity: String,
    category: String
  }],
  instructions: [String],
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  },
  image: String,
  
  // Nutritional Information
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number
  },
  
  // Tags as simple array for now (we can enhance later)
  tags: [String],
  
  // Add separate fields for categorization
  dietType: [String],
  healthGoals: [String],
  mealType: [String],
  cuisine: [String],
  
  restrictions: [String],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);