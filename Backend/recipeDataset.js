// backend/recipeDataset.js
let idCounter = 1;
const comprehensiveRecipes = [
  { "_id": 1,
    title: "Peanut Chickpea Protein Bowl",
    description: "A delicious and protein-packed bowl with chickpeas and peanut sauce",
    ingredients: [
      { name: "chickpeas", quantity: "1 can", category: "protein" },
      { name: "peanut butter", quantity: "2 tbsp", category: "protein" },
      { name: "brown rice", quantity: "1 cup", category: "carb" },
      { name: "spinach", quantity: "2 cups", category: "vegetable" },
      { name: "carrots", quantity: "1 medium", category: "vegetable" }
    ],
    instructions: [
      "Cook rice according to package instructions",
      "Drain and rinse chickpeas",
      "Mix peanut butter with soy sauce and lime juice to create sauce",
      "Combine rice, chickpeas, vegetables and sauce in a bowl",
      "Garnish with green onions and sesame seeds"
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: "Easy",
    image: "peanut-chickpea-protein-bowl.jpeg",
    nutrition: {
      calories: 450,
      protein: 18,
      carbs: 65,
      fat: 12,
      fiber: 10,
      sugar: 8,
      sodium: 420
    },
    tags: ["vegan", "gluten-free", "high-protein", "muscle-gain", "high-fiber", "heart-healthy", "lunch", "dinner", "asian"],
    dietType: ["vegan", "gluten-free"],
    healthGoals: ["muscle-gain", "high-protein", "energy"],
    mealType: ["lunch", "dinner"],
    cuisine: ["asian"],
    restrictions: ["nuts"]
  },
  {
      
  
    title: "Sweet Sour Tofu",
    description: "Crispy tofu in a tangy sweet and sour sauce with fresh vegetables",
    ingredients: [
      { name: "tofu", quantity: "1 block", category: "protein" },
      { name: "bell peppers", quantity: "2", category: "vegetable" },
      { name: "pineapple", quantity: "1 cup", category: "fruit" },
      { name: "brown rice", quantity: "1 cup", category: "carb" }
    ],
    instructions: [
      "Press and cube tofu, coat with corn starch",
      "Pan-fry tofu until crispy",
      "Stir-fry bell peppers and pineapple",
      "Make sweet and sour sauce with soy sauce, vinegar, and honey",
      "Combine everything and simmer for 5 minutes"
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    difficulty: "Medium",
    image: "sweet-sour-tofu.jpg", 
    nutrition: {
      calories: 380,
      protein: 22,
      carbs: 55,
      fat: 8,
      fiber: 6,
      sugar: 18,
      sodium: 680
    },
    tags: ["vegetarian", "high-protein", "balanced", "diabetes-friendly", "lunch", "dinner", "asian"],
    dietType: ["vegetarian"],
    healthGoals: ["muscle-gain", "balanced"],
    mealType: ["lunch", "dinner"],
    cuisine: ["asian"],
    restrictions: ["soy"]
  },
  {
    title: "Mediterranean Quinoa Salad",
    description: "Fresh and healthy quinoa salad with Mediterranean flavors",
    ingredients: [
      { name: "quinoa", quantity: "1 cup", category: "carb" },
      { name: "cherry tomatoes", quantity: "1 cup", category: "vegetable" },
      { name: "cucumber", quantity: "1", category: "vegetable" },
      { name: "feta cheese", quantity: "1/2 cup", category: "dairy" },
      { name: "olive oil", quantity: "2 tbsp", category: "fat" }
    ],
    instructions: [
      "Cook quinoa according to package instructions",
      "Dice cucumber and halve cherry tomatoes",
      "Mix quinoa with vegetables",
      "Add crumbled feta cheese",
      "Dress with olive oil and lemon juice"
    ],
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    image: "mediterranean-quinoa.jpg",
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 10,
      fiber: 8,
      sugar: 6,
      sodium: 380
    },
    tags: ["vegetarian", "gluten-free", "weight-loss", "balanced", "heart-healthy", "high-fiber", "lunch", "dinner", "mediterranean"],
    dietType: ["vegetarian", "gluten-free"],
    healthGoals: ["weight-loss", "balanced"],
    mealType: ["lunch", "dinner"],
    cuisine: ["mediterranean"],
    restrictions: ["dairy"]
  },
  {
    title: "Green Power Smoothie",
    description: "Nutrient-packed smoothie for energy and vitality",
    ingredients: [
      { name: "spinach", quantity: "2 cups", category: "vegetable" },
      { name: "banana", quantity: "1", category: "fruit" },
      { name: "protein powder", quantity: "1 scoop", category: "protein" },
      { name: "almond milk", quantity: "1 cup", category: "dairy-alternative" }
    ],
    instructions: [
      "Combine all ingredients in blender",
      "Blend until smooth",
      "Serve immediately"
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    image: "green-smoothie.jpeg",
    nutrition: {
      calories: 280,
      protein: 25,
      carbs: 35,
      fat: 5,
      fiber: 7,
      sugar: 20,
      sodium: 180
    },
    tags: ["vegan", "gluten-free", "dairy-free", "weight-loss", "energy", "muscle-gain", "high-fiber", "low-sodium", "breakfast", "snack"],
    dietType: ["vegan", "gluten-free", "dairy-free"],
    healthGoals: ["weight-loss", "energy", "muscle-gain"],
    mealType: ["breakfast", "snack"],
    cuisine: ["smoothie"],
    restrictions: ["nuts"]
  },
  {
    title: "Low-Carb Chicken Stir Fry",
    description: "Quick and easy chicken stir fry with low carbohydrate content",
    ingredients: [
      { name: "chicken breast", quantity: "200g", category: "protein" },
      { name: "broccoli", quantity: "2 cups", category: "vegetable" },
      { name: "bell peppers", quantity: "1", category: "vegetable" },
      { name: "soy sauce", quantity: "2 tbsp", category: "sauce" }
    ],
    instructions: [
      "Slice chicken into strips",
      "Stir-fry chicken until cooked",
      "Add vegetables and cook until tender-crisp",
      "Add sauce and simmer for 2 minutes"
    ],
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    difficulty: "Easy",
    image: "chicken-stir-fry.jpg",
    nutrition: {
      calories: 290,
      protein: 35,
      carbs: 12,
      fat: 8,
      fiber: 4,
      sugar: 6,
      sodium: 720
    },
    tags: ["gluten-free", "weight-loss", "muscle-gain", "low-carb", "high-protein", "diabetes-friendly", "lunch", "dinner", "asian"],
    dietType: ["gluten-free"],
    healthGoals: ["weight-loss", "muscle-gain", "low-carb"],
    mealType: ["lunch", "dinner"],
    cuisine: ["asian"],
    restrictions: ["soy"]
  },
  {
    title: "Heart-Healthy Oatmeal",
    description: "Warm oatmeal packed with heart-healthy ingredients",
    ingredients: [
      { name: "oats", quantity: "1/2 cup", category: "carb" },
      { name: "berries", quantity: "1/2 cup", category: "fruit" },
      { name: "walnuts", quantity: "1 tbsp", category: "fat" },
      { name: "chia seeds", quantity: "1 tsp", category: "seed" }
    ],
    instructions: [
      "Cook oats with water or milk",
      "Top with berries, walnuts, and chia seeds",
      "Drizzle with honey if desired"
    ],
    prepTime: 2,
    cookTime: 5,
    servings: 1,
    difficulty: "Easy",
    image: "healthy-oatmeal.jpg",
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 48,
      fat: 10,
      fiber: 9,
      sugar: 12,
      sodium: 5
    },
    tags: ["vegetarian", "gluten-free", "weight-loss", "heart-health", "heart-healthy", "high-fiber", "low-sodium", "breakfast"],
    dietType: ["vegetarian", "gluten-free"],
    healthGoals: ["weight-loss", "heart-health"],
    mealType: ["breakfast"],
    cuisine: ["american"],
    restrictions: ["nuts"]
  },
  {
    title: "Keto Avocado Egg Bowl",
    description: "High-fat, low-carb breakfast bowl perfect for keto diet",
    ingredients: [
      { name: "avocado", quantity: "1", category: "fat" },
      { name: "eggs", quantity: "2", category: "protein" },
      { name: "spinach", quantity: "1 cup", category: "vegetable" },
      { name: "bacon", quantity: "2 slices", category: "protein" }
    ],
    instructions: [
      "Cook bacon until crispy",
      "Fry eggs to your preference",
      "Slice avocado and arrange with spinach",
      "Top with eggs and bacon"
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    difficulty: "Easy",
    image: "avocado-egg-bowl.jpg",
    nutrition: {
      calories: 450,
      protein: 25,
      carbs: 8,
      fat: 35,
      fiber: 7,
      sugar: 2,
      sodium: 620
    },
    tags: ["keto", "gluten-free", "weight-loss", "keto-diet", "low-carb", "high-protein", "low-sugar", "breakfast"],
    dietType: ["keto", "gluten-free"],
    healthGoals: ["weight-loss", "keto", "low-carb"],
    mealType: ["breakfast"],
    cuisine: ["american"],
    restrictions: []
  },
  {
    title: "High-Protein Lentil Soup",
    description: "Hearty lentil soup packed with plant-based protein",
    ingredients: [
      { name: "lentils", quantity: "1 cup", category: "protein" },
      { name: "carrots", quantity: "2", category: "vegetable" },
      { name: "celery", quantity: "2 stalks", category: "vegetable" },
      { name: "onion", quantity: "1", category: "vegetable" }
    ],
    instructions: [
      "Sauté vegetables until soft",
      "Add lentils and broth",
      "Simmer for 30 minutes until lentils are tender",
      "Season with herbs and spices"
    ],
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    difficulty: "Easy",
    image: "lentil-soup.jpeg",
    nutrition: {
      calories: 280,
      protein: 18,
      carbs: 45,
      fat: 2,
      fiber: 15,
      sugar: 8,
      sodium: 480
    },
    tags: ["vegan", "gluten-free", "muscle-gain", "weight-loss", "high-protein", "high-fiber", "heart-healthy", "low-fat", "lunch", "dinner"],
    dietType: ["vegan", "gluten-free"],
    healthGoals: ["muscle-gain", "weight-loss", "high-protein"],
    mealType: ["lunch", "dinner"],
    cuisine: ["mediterranean"],
    restrictions: []
  },
  {
    title: "Diabetes-Friendly Berry Parfait",
    description: "Low-sugar parfait perfect for blood sugar management",
    ingredients: [
      { name: "Greek yogurt", quantity: "1 cup", category: "dairy" },
      { name: "mixed berries", quantity: "1/2 cup", category: "fruit" },
      { name: "almonds", quantity: "1 tbsp", category: "nut" },
      { name: "chia seeds", quantity: "1 tsp", category: "seed" }
    ],
    instructions: [
      "Layer Greek yogurt in a glass",
      "Add mixed berries",
      "Sprinkle with almonds and chia seeds",
      "Top with cinnamon"
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
    image: "berry-parfait.jpg",
    nutrition: {
      calories: 220,
      protein: 20,
      carbs: 18,
      fat: 8,
      fiber: 6,
      sugar: 10,
      sodium: 80
    },
    tags: ["vegetarian", "gluten-free", "weight-loss", "diabetes-friendly", "low-sugar", "high-protein", "breakfast", "snack"],
    dietType: ["vegetarian", "gluten-free"],
    healthGoals: ["weight-loss", "diabetes-friendly"],
    mealType: ["breakfast", "snack"],
    cuisine: ["american"],
    restrictions: ["dairy", "nuts"]
  },
  {
    title: "Beef & Sweet Potato",
    description: "High-protein meal perfect for post-workout recovery",
    ingredients: [
      { name: "lean beef", quantity: "150g", category: "protein" },
      { name: "sweet potato", quantity: "1 large", category: "carb" },
      { name: "broccoli", quantity: "1 cup", category: "vegetable" },
      { name: "olive oil", quantity: "1 tbsp", category: "fat" }
    ],
    instructions: [
      "Bake sweet potato until tender",
      "Grill or pan-sear beef to preference",
      "Steam broccoli until crisp-tender",
      "Combine all ingredients and season"
    ],
    prepTime: 10,
    cookTime: 25,
    servings: 1,
    difficulty: "Easy",
    image: "beef-sweet-potato.jpg",
    nutrition: {
      calories: 480,
      protein: 40,
      carbs: 45,
      fat: 15,
      fiber: 8,
      sugar: 12,
      sodium: 320
    },
    tags: ["gluten-free", "muscle-gain", "high-protein", "balanced", "recovery", "lunch", "dinner"],
    dietType: ["gluten-free"],
    healthGoals: ["muscle-gain", "high-protein", "recovery"],
    mealType: ["lunch", "dinner"],
    cuisine: ["american"],
    restrictions: []
  }
];

module.exports = comprehensiveRecipes;