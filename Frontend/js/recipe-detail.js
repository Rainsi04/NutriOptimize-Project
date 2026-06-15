document.addEventListener('DOMContentLoaded', function() {
    const recipeDetailContent = document.querySelector('.recipe-detail-content');
    
    // Get recipe data from sessionStorage
    const recipeData = JSON.parse(sessionStorage.getItem('currentRecipe'));
    
    if (!recipeData) {
        console.warn('No recipe data found in sessionStorage');
        window.location.href = 'recipes.html';
        return;
    }
    
    console.log('Loaded recipe data:', recipeData);
    
    const recipeContent = generateRecipeContent(recipeData);
    recipeDetailContent.innerHTML = recipeContent;
    
    document.title = `${recipeData.title} - NutriOptimize`;
    
    document.querySelector('.btn-print')?.addEventListener('click', printRecipe);
    document.querySelector('.btn-back')?.addEventListener('click', () => {
        window.history.back();
    });
    
    console.log(`🍽️ Recipe Detail Loaded: ${recipeData.title}`);
});

function generateRecipeContent(recipe) {
    // Get recipe details - use the actual recipe data instead of hardcoded lookup
    const recipeDetails = getRecipeDetailsFromData(recipe);
    
    return `
        <div class="recipe-header">
            <div class="recipe-image">
                <img src="images/${recipe.image || 'default-recipe.jpg'}" alt="${recipe.title}" onerror="this.src='images/default-recipe.jpg'">
            </div>
            <div class="recipe-title-section">
                <h1>${recipe.title || 'Unknown Recipe'}</h1>
                <p class="recipe-description">${recipe.description || 'A delicious and healthy recipe'}</p>
                <div class="recipe-meta-detail">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${recipe.prepTime || '15'} mins</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-users"></i>
                        <span>${recipe.servings || '2'} servings</span>
                    </div>
                </div>
                <div class="recipe-tags-detail">
                    ${(recipe.tags || []).map(tag => `
                        <span class="tag ${tag.toLowerCase().replace(/ /g, '-')}">${tag}</span>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="recipe-body">
            <!-- Nutrition Facts - Horizontal Layout -->
            <section class="nutrition-section">
                <h2>Nutrition Facts (per serving)</h2>
                <div class="nutrition-facts-horizontal">
                    <div class="nutrition-item-horizontal">
                        <span class="nutrition-value-large">${recipe.nutrition?.calories || recipe.calories || 'N/A'}</span>
                        <span class="nutrition-label-small">Calories</span>
                    </div>
                    <div class="nutrition-item-horizontal">
                        <span class="nutrition-value-large">${recipe.nutrition?.protein || 'N/A'}g</span>
                        <span class="nutrition-label-small">Protein</span>
                    </div>
                    <div class="nutrition-item-horizontal">
                        <span class="nutrition-value-large">${recipe.nutrition?.carbs || 'N/A'}g</span>
                        <span class="nutrition-label-small">Carbs</span>
                    </div>
                    <div class="nutrition-item-horizontal">
                        <span class="nutrition-value-large">${recipe.nutrition?.fat || 'N/A'}g</span>
                        <span class="nutrition-label-small">Fat</span>
                    </div>
                    <div class="nutrition-item-horizontal">
                        <span class="nutrition-value-large">${recipe.nutrition?.fiber || 'N/A'}g</span>
                        <span class="nutrition-label-small">Fiber</span>
                    </div>
                </div>
            </section>
            
            <!-- Ingredients and Instructions Side by Side -->
            <div class="recipe-content-grid">
                <!-- Left Column - Ingredients -->
                <div class="left-column">
                    <section class="ingredients-section">
                        <h2>Ingredients</h2>
                        <ul class="ingredients-list-simple">
                            ${recipeDetails.ingredients.map(ingredient => `
                                <li class="ingredient-item-simple">${ingredient}</li>
                            `).join('')}
                        </ul>
                    </section>
                </div>
                
                <!-- Right Column - Instructions -->
                <div class="right-column">
                    <section class="instructions-section">
                        <h2>Instructions</h2>
                        <ol class="instructions-list-simple">
                            ${recipeDetails.instructions.map(instruction => `
                                <li class="instruction-item-simple">${instruction}</li>
                            `).join('')}
                        </ol>
                    </section>
                </div>
            </div>
            
            <!-- Optimization Section -->
            <section class="optimization-section">
                <div class="optimization-score">
                    <h3>Optimization Score: <span class="score">${recipeDetails.optimizationScore}/100</span></h3>
                    <p>This recipe has been optimized for nutritional balance, providing excellent macronutrient ratios while maintaining great taste and ease of preparation.</p>
                </div>
            </section>
            
            <!-- Action Buttons -->
            <div class="action-buttons">
                <button class="btn-print">
                    <i class="fas fa-print"></i>
                    Print Recipe
                </button>
                <button class="btn-back">
                    <i class="fas fa-arrow-left"></i>
                    Back to Recipes
                </button>
            </div>
        </div>
    `;
}

function getRecipeDetailsFromData(recipe) {
    // First, try to use the actual recipe data
    if (recipe.ingredients && recipe.instructions) {
        // Convert ingredients array to simple strings if they are objects
        const ingredients = recipe.ingredients.map(ing => {
            if (typeof ing === 'object' && ing.name && ing.quantity) {
                return `${ing.quantity} ${ing.name}`;
            }
            return ing;
        });
        
        return {
            ingredients: ingredients,
            instructions: recipe.instructions,
            optimizationScore: calculateOptimizationScore(recipe),
            fiber: recipe.nutrition?.fiber || 'N/A'
        };
    }
    
    // Fallback to hardcoded data if recipe doesn't have ingredients/instructions
    const hardcodedDetails = getRecipeDetails(recipe.title);
    return hardcodedDetails;
}

function calculateOptimizationScore(recipe) {
    // Simple scoring based on nutrition data
    let score = 80; // Base score
    
    const nutrition = recipe.nutrition;
    if (nutrition) {
        // Add points for good protein
        if (nutrition.protein >= 15) score += 5;
        if (nutrition.protein >= 20) score += 5;
        
        // Add points for reasonable calories
        if (nutrition.calories >= 300 && nutrition.calories <= 600) score += 5;
        
        // Add points for good fiber
        if (nutrition.fiber >= 5) score += 5;
        
        // Deduct points for high sugar
        if (nutrition.sugar > 20) score -= 5;
        
        // Deduct points for high sodium
        if (nutrition.sodium > 800) score -= 5;
    }
    
    // Ensure score is between 0-100
    return Math.min(100, Math.max(0, score));
}

// Keep your existing getRecipeDetails function for fallback
function getRecipeDetails(recipeTitle) {
    const recipes = {
        'Peanut Chickpea Protein Bowl': {
            ingredients: [
                '1 cup boiled chickpeas (or canned, rinsed)',
                '½ cup cooked quinoa or brown rice',
                '½ cup cucumber, chopped',
                '½ cup tomato, chopped',
                '¼ cup grated carrot',
                '¼ cup roasted peanuts (unsalted)',
                '1 tbsp olive oil (for sautéing)',
                '½ tsp cumin powder',
                '½ tsp chaat masala',
                'Salt and black pepper to taste',
                'Fresh coriander leaves for garnish',
                '1 tsp lemon juice (optional)',
                '2 tbsp natural peanut butter',
                '1 tbsp lemon juice (for dressing)',
                '1 tsp soy sauce or tamari',
                '1 clove garlic, finely minced',
                '½ tsp honey or jaggery',
                '2-3 tbsp warm water (to thin the dressing)'
            ],
            instructions: [
                'Heat olive oil in a pan',
                'Add chickpeas, cumin powder, chaat masala, salt, and pepper',
                'Sauté for 5-6 minutes until slightly crispy; set aside',
                'In a small bowl, whisk together peanut butter, lemon juice, soy sauce, garlic, and honey',
                'Add warm water gradually and whisk until smooth and creamy',
                'In two serving bowls, add a base of quinoa or brown rice',
                'Layer with sautéed chickpeas, cucumber, tomato, carrot, and roasted peanuts',
                'Drizzle the peanut dressing generously over the top',
                'Garnish with fresh coriander leaves and lemon juice',
                'Serve warm or chilled'
            ],
            optimizationScore: 93,
            fiber: '9g'
        },
        'Sweet Sour Tofu': {
            ingredients: [
                '1 block firm tofu, pressed and cubed',
                '2 bell peppers, sliced',
                '1 cup pineapple chunks',
                '1 cup brown rice, cooked',
                '2 tbsp corn starch',
                '2 tbsp soy sauce',
                '1 tbsp rice vinegar',
                '1 tbsp honey',
                '1 tbsp vegetable oil'
            ],
            instructions: [
                'Coat tofu cubes with corn starch',
                'Pan-fry tofu until crispy and golden',
                'Stir-fry bell peppers and pineapple until tender',
                'Make sweet and sour sauce with soy sauce, vinegar, and honey',
                'Combine everything and simmer for 5 minutes',
                'Serve over brown rice'
            ],
            optimizationScore: 85,
            fiber: '6g'
        },
        'Mediterranean Quinoa Salad': {
            ingredients: [
                '1 cup quinoa, cooked',
                '1 cup cherry tomatoes, halved',
                '1 cucumber, diced',
                '½ cup feta cheese, crumbled',
                '2 tbsp olive oil',
                '1 tbsp lemon juice',
                '¼ cup red onion, finely chopped',
                '2 tbsp fresh parsley, chopped',
                'Salt and pepper to taste'
            ],
            instructions: [
                'Cook quinoa according to package instructions and let cool',
                'Dice cucumber and halve cherry tomatoes',
                'Mix quinoa with vegetables in a large bowl',
                'Add crumbled feta cheese and fresh parsley',
                'Dress with olive oil, lemon juice, salt, and pepper',
                'Toss gently to combine and serve chilled'
            ],
            optimizationScore: 88,
            fiber: '8g'
        },
        // Add other recipes here...
        'Green Power Smoothie': {
            ingredients: [
                '2 cups fresh spinach',
                '1 banana',
                '1 scoop protein powder',
                '1 cup almond milk',
                '1 tbsp chia seeds',
                '½ cup Greek yogurt',
                '1 tsp honey (optional)'
            ],
            instructions: [
                'Combine all ingredients in blender',
                'Blend on high until smooth and creamy',
                'Add more liquid if needed for desired consistency',
                'Pour into glass and serve immediately'
            ],
            optimizationScore: 90,
            fiber: '7g'
        }
        // Add the rest of your recipes...
    };
    
    return recipes[recipeTitle] || {
        ingredients: ['Ingredients not available for this recipe'],
        instructions: ['Recipe instructions not available'],
        optimizationScore: 0,
        fiber: '0g'
    };
}

function printRecipe() {
    window.print();
}

const printStyles = `
@media print {
    header, footer, .action-buttons {
        display: none !important;
    }
    
    .recipe-detail-container {
        padding: 0 !important;
        background: white !important;
    }
    
    .recipe-detail-content {
        box-shadow: none !important;
        border-radius: 0 !important;
    }
    
    .recipe-image {
        height: 200px !important;
    }
    
    .recipe-body {
        padding: 20px !important;
    }
    
    .recipe-content-grid {
        display: block !important;
    }
    
    .left-column, .right-column {
        margin-bottom: 30px;
    }
    
    .nutrition-facts-horizontal {
        grid-template-columns: repeat(5, 1fr) !important;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);