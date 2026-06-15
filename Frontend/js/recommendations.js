// js/recommendations.js
// Uses backend recommendations endpoint and shows images from backend uploads

document.addEventListener('DOMContentLoaded', function() {
  const BACKEND_URL = "http://localhost:5000";
  const PLACEHOLDER = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";

  const form = document.getElementById('recommendationsForm');
  const resultsSection = document.getElementById('recommendationsResults');
  const loadingMessage = document.getElementById('loadingMessage');
  const errorMessage = document.getElementById('errorMessage');
  const userProfileSummary = document.getElementById('userProfileSummary');
  const recipesGrid = document.getElementById('recipesGrid');

  // Image mapping (optional manual mapping)
  const ImageUtils = {
    recipeImageMap: {
      'Peanut Chickpea Protein Bowl': 'peanut-chickpea-protein-bowl.jpeg',
      'Beef & Sweet Potato': 'beef-sweet-potato.jpg',
      'Mediterranean Quinoa Salad': 'mediterranean-quinoa.jpg',
      'Sweet Sour Tofu': 'sweet-sour-tofu.jpg',
      'Keto Avocado Egg Bowl': 'avocado-egg-bowl.jpg',
      'Heart-Healthy Oatmeal': 'healthy-oatmeal.jpg',
      'Green Power Smoothie': 'green-smoothie.jpeg',
      'Low-Carb Chicken Stir Fry': 'chicken-stir-fry.jpg',
      'High-Protein Lentil Soup': 'lentil-soup.jpeg',
      'Diabetes-Friendly Berry Parfait': 'berry-parfait.jpg'
    },

    getImagePath(recipeTitle, recipeImage) {
      // prefer explicit mapping, otherwise construct backend uploads path
      const mappedImage = this.recipeImageMap[recipeTitle];
      if (mappedImage) return `${BACKEND_URL}/uploads/${mappedImage}`;
      if (recipeImage) {
        if (recipeImage.startsWith('http')) return recipeImage;
        if (recipeImage.includes('/')) return recipeImage;
        return `${BACKEND_URL}/uploads/${recipeImage}`;
      }
      return this.getPlaceholderImage();
    },

    getPlaceholderImage() { return PLACEHOLDER; },

    handleImageError(imgElement) {
      console.warn('Image failed to load:', imgElement.src);
      imgElement.src = this.getPlaceholderImage();
      imgElement.alt = 'Recipe image not available';
    }
  };

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
      age: parseInt(document.getElementById('age').value),
      weight: parseFloat(document.getElementById('weight').value),
      height: parseInt(document.getElementById('height').value),
      sex: document.getElementById('sex').value,
      activity: document.getElementById('activity').value,
      goal: document.getElementById('goal').value,
      diseases: document.getElementById('diseases').value
        .split(',')
        .map(d => d.trim())
        .filter(d => d.length > 0)
    };

    await getPersonalizedRecommendations(formData);
  });

 async function getPersonalizedRecommendations(userData) {
    resultsSection.style.display = 'block';
    loadingMessage.style.display = 'flex';
    errorMessage.style.display = 'none';
    userProfileSummary.style.display = 'none';
    recipesGrid.innerHTML = '';

    try {
        // Show user profile
        const heightInMeters = userData.height / 100;
        const bmi = (userData.weight / (heightInMeters * heightInMeters)).toFixed(1);
        showUserProfileSummary(userData, bmi);

        // FIRST: Try to get recommendations from backend
        const response = await fetch(`${BACKEND_URL}/api/recommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error(`Server responded with ${response.status}`);

        let recommendedRecipes = await response.json();
        
        console.log('Backend returned recipes:', recommendedRecipes);
        
        // CHECK: If backend returns only parfait recipes, use client-side filtering
        const isOnlyParfait = recommendedRecipes && recommendedRecipes.length > 0 && 
                             recommendedRecipes.every(recipe => 
                                 recipe.title && recipe.title.includes('Parfait') || 
                                 recipe.title && recipe.title.includes('Berry')
                             );
        
        if (isOnlyParfait || !recommendedRecipes || recommendedRecipes.length === 0) {
            console.log('Backend returned only parfait recipes, using client-side filtering');
            recommendedRecipes = await applyClientSideFiltering(userData);
        } else {
            // Remove duplicates from backend response
            recommendedRecipes = getUniqueRecipes(recommendedRecipes);
        }
        
        loadingMessage.style.display = 'none';

        if (!recommendedRecipes || recommendedRecipes.length === 0) {
            showNoRecipesMessage();
        } else {
            renderRecipes(recommendedRecipes);
            showRecommendationSummary(recommendedRecipes, userData);
        }
    } catch (err) {
        console.error('Error getting recommendations:', err);
        // If backend fails, use client-side filtering
        console.log('Backend failed, using client-side filtering');
        try {
            const clientSideRecipes = await applyClientSideFiltering(userData);
            loadingMessage.style.display = 'none';
            if (clientSideRecipes && clientSideRecipes.length > 0) {
                renderRecipes(clientSideRecipes);
                showRecommendationSummary(clientSideRecipes, userData);
            } else {
                showNoRecipesMessage();
            }
        } catch (fallbackError) {
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'flex';
            errorMessage.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <strong>Failed to load recommendations</strong>
                    <p>${err.message}</p>
                    <small>Make sure your backend server is running on port 5000</small>
                </div>
            `;
        }
    }
}

// NEW: Aggressive client-side filtering that ignores backend parfait response
async function applyClientSideFiltering(userData) {
    try {
        console.log('Applying client-side filtering for goal:', userData.goal);
        
        // Get all recipes from backend
        const response = await fetch(`${BACKEND_URL}/api/recipes`);
        if (!response.ok) {
            console.error('Failed to fetch all recipes');
            return [];
        }
        
        const allRecipes = await response.json();
        console.log('Total recipes available:', allRecipes.length);
        
        // Filter out parfait recipes completely for now
        const recipesWithoutParfait = allRecipes.filter(recipe => 
            !recipe.title.includes('Parfait') && 
            !recipe.title.includes('Berry Parfait')
        );
        
        console.log('Recipes without parfait:', recipesWithoutParfait.length);
        
        // Score recipes based on user goals
        const scoredRecipes = recipesWithoutParfait.map(recipe => {
            let score = 0;
            const nutrition = recipe.nutrition || {};
            const calories = nutrition.calories || 0;
            const protein = nutrition.protein || 0;
            const carbs = nutrition.carbs || 0;
            const fat = nutrition.fat || 0;
            
            // Goal-based scoring (more aggressive)
            if (userData.goal === 'weight-loss') {
                if (calories < 350) score += 40;
                if (calories < 250) score += 30;
                if (protein > 15) score += 20;
                if (recipe.tags && recipe.tags.includes('low-calorie')) score += 25;
            }
            
            if (userData.goal === 'muscle-gain') {
                if (protein > 25) score += 40;
                if (protein > 30) score += 30;
                if (calories > 450) score += 20;
                if (recipe.tags && recipe.tags.includes('high-protein')) score += 25;
            }
            
            if (userData.goal === 'balanced') {
                if (calories > 300 && calories < 500) score += 30;
                if (protein > 15 && protein < 30) score += 20;
                if (carbs > 30 && carbs < 60) score += 15;
                if (recipe.tags && recipe.tags.includes('balanced')) score += 25;
            }
            
            // Activity level
            if (userData.activity === 'high' && calories > 400) score += 20;
            if (userData.activity === 'low' && calories < 300) score += 20;
            
            return {
                ...recipe,
                score: score
            };
        });
        
        // Filter and sort - be more selective
        const filteredRecipes = scoredRecipes
            .filter(recipe => recipe.score > 30) // Higher threshold
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);
        
        console.log('Final filtered recipes:', filteredRecipes.map(r => ({ title: r.title, score: r.score })));
        return filteredRecipes;
        
    } catch (error) {
        console.error('Client-side filtering failed:', error);
        return [];
    }
}

// Helper function to remove duplicates
function getUniqueRecipes(recipes) {
    const seen = new Set();
    return recipes.filter(recipe => {
        const id = recipe._id || recipe.title;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    });
}
  function showUserProfileSummary(userData, bmi) {
    userProfileSummary.style.display = 'block';
    userProfileSummary.innerHTML = `
      <div class="profile-card">
        <h3><i class="fas fa-user-circle"></i> Your Profile</h3>
        <div class="profile-details">
          <div class="profile-item"><span class="label">Age</span><span class="value">${userData.age} years</span></div>
          <div class="profile-item"><span class="label">Weight</span><span class="value">${userData.weight} kg</span></div>
          <div class="profile-item"><span class="label">Height</span><span class="value">${userData.height} cm</span></div>
          <div class="profile-item"><span class="label">BMI</span><span class="value">${bmi}</span></div>
          <div class="profile-item"><span class="label">Activity</span><span class="value">${userData.activity}</span></div>
          <div class="profile-item"><span class="label">Goal</span><span class="value">${userData.goal}</span></div>
        </div>
      </div>
    `;
  }

  function renderRecipes(recipes) {
    recipesGrid.innerHTML = '';
    recipes.forEach(recipe => {
      const card = createRecipeCard(recipe);
      recipesGrid.appendChild(card);
    });
    attachRecipeEventListeners();
  }

  function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    const imagePath = ImageUtils.getImagePath(recipe.title || recipe.name, recipe.image);

    card.innerHTML = `
      ${recipe.score ? `<div class="recipe-score">${Math.round(recipe.score)}% match</div>` : ''}
      <div class="recipe-image">
        <img src="${imagePath}" alt="${recipe.title || recipe.name}" onerror="this.onerror=null;this.src='${PLACEHOLDER}';">
      </div>
      <div class="recipe-content">
        <h3>${recipe.title || recipe.name}</h3>
        <p class="recipe-description">${recipe.description || recipe.summary || ''}</p>
        <div class="recipe-meta">
          <div class="time">${(recipe.prepTime || 0) + (recipe.cookTime || 0)} mins</div>
          <div class="difficulty">${recipe.difficulty || 'Easy'}</div>
        </div>
        <div class="recipe-tags">${(recipe.tags || []).slice(0,3).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <button class="view-recipe-btn btn btn-primary" data-recipe-id="${recipe._id || recipe.id}">View Recipe</button>
      </div>
    `;
    // attach recipe data for fallback
    card._recipeData = recipe;
    return card;
  }

 function attachRecipeEventListeners() {
    recipesGrid.addEventListener('click', function(e) {
        const btn = e.target.closest('.view-recipe-btn');
        if (!btn) return;
        
        const recipeCard = btn.closest('.recipe-card');
        const recipe = recipeCard?._recipeData;
        
        if (recipe) {
            // PROCESS THE RECIPE DATA BEFORE STORING
            const processedRecipe = {
                ...recipe,
                ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : ['Ingredients not available'],
                instructions: Array.isArray(recipe.instructions) ? recipe.instructions : ['Instructions not available'],
                calories: recipe.nutrition?.calories || 'N/A',
                protein: recipe.nutrition?.protein || 'N/A',
                carbs: recipe.nutrition?.carbs || 'N/A',
                fat: recipe.nutrition?.fat || 'N/A',
                fiber: recipe.nutrition?.fiber || 'N/A'
            };
            
            console.log('Sending recipe to detail:', processedRecipe.title);
            
            try { 
                sessionStorage.setItem('currentRecipe', JSON.stringify(processedRecipe)); 
            } catch (e) {
                console.error('Failed to store recipe:', e);
            }
            
            window.location.href = 'recipe-detail.html';
        } else {
            alert('Recipe details not available');
        }
    });
}

  function showNoRecipesMessage() {
    recipesGrid.innerHTML = `
      <div class="no-recipes">
        <i class="fas fa-search"></i>
        <h3>No Perfect Matches Found</h3>
        <p>Try adjusting your profile or browse all recipes.</p>
        <a href="recipes.html" class="btn btn-primary"><i class="fas fa-compass"></i> Browse All Recipes</a>
      </div>
    `;
  }

  function showRecommendationSummary(recipes, userData) {
    const summary = document.createElement('div');
    summary.className = 'recommendation-summary';
    const avgMatch = Math.round(recipes.reduce((sum, r) => sum + (r.score || 0), 0) / recipes.length || 0);
    const highProteinCount = recipes.filter(r => r.nutrition?.protein > 20).length;
    const avgCalories = Math.round(recipes.reduce((sum, r) => sum + (r.nutrition?.calories || 0), 0) / recipes.length || 0);

    summary.innerHTML = `
      <div class="summary-card">
        <h3><i class="fas fa-chart-line"></i> Your Personalized Plan</h3>
        <p>Based on your profile, we found ${recipes.length} recipes that match your needs.</p>
        <div class="summary-stats">
          <div class="stat"><span class="stat-value">${avgMatch}%</span><span class="stat-label">Avg Match</span></div>
          <div class="stat"><span class="stat-value">${highProteinCount}</span><span class="stat-label">High Protein</span></div>
          <div class="stat"><span class="stat-value">${avgCalories}</span><span class="stat-label">Avg Calories</span></div>
        </div>
      </div>
    `;
    recipesGrid.parentNode.insertBefore(summary, recipesGrid);
  }

});