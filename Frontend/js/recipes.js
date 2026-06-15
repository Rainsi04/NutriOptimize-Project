// js/recipes.js
// Fetch recipes from backend and render grid. Ensures image URLs use backend /uploads/.

document.addEventListener('DOMContentLoaded', function() {
  const BACKEND_URL = "http://localhost:5000"; // change if needed
  const PLACEHOLDER = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";

  const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
  const sortButtons = document.querySelectorAll('.filter-btn[data-sort]');
  const searchInput = document.querySelector('.search-bar input');
  const recipesGrid = document.getElementById('recipesGrid');

  let currentFilter = 'all';
  let currentSort = 'optimized';
  let allRecipes = [];

  initializeRecipes();

  async function initializeRecipes() {
    try {
      const recipes = await fetchRecipesFromBackend();
      allRecipes = recipes;
      renderRecipes(recipes);
      console.log('Recipes loaded from backend:', recipes.length);
    } catch (error) {
      console.error('Error loading recipes from backend:', error);
      // Fallback to static markup already in HTML (if any)
      console.log('Using static recipes as fallback');
      // You can optionally call a function to render local fallback recipes here
    } finally {
      attachEventListeners();
    }
  }

  async function fetchRecipesFromBackend() {
    const response = await fetch(`${BACKEND_URL}/api/recipes`);
    if (!response.ok) throw new Error('Failed to fetch recipes from backend');
    return await response.json();
  }

  function getImageUrl(img) {
    if (!img) return PLACEHOLDER;
    if (img.startsWith('http')) return img;
    if (img.includes('/')) return img; // already a path
    return `${BACKEND_URL}/uploads/${img}`;
  }

  function renderRecipes(recipes) {
    recipesGrid.innerHTML = '';
    recipes.forEach(recipe => {
      const card = createRecipeCard(recipe);
      recipesGrid.appendChild(card);
    });

    // After rendering, attach view buttons
    attachRecipeEventListeners();
  }

  function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    const tagsArray = Array.isArray(recipe.tags) ? recipe.tags : (recipe.tagList || []);
    const tagString = tagsArray.join(' ');
    card.setAttribute('data-category', tagString);
    card.setAttribute('data-time', (recipe.prepTime || 0) + (recipe.cookTime || 0));
    card.setAttribute('data-calories', recipe.nutrition?.calories || recipe.calories || 0);

    const imageUrl = getImageUrl(recipe.image || recipe.imagePath || recipe.img);

    card.innerHTML = `
      <div class="recipe-image">
        <img src="${imageUrl}" alt="${recipe.title || recipe.name}" class="recipe-image" 
             onerror="this.onerror=null;this.src='${PLACEHOLDER}';">
      </div>
      <div class="recipe-content">
        <h3>${recipe.title || recipe.name}</h3>
        <p class="recipe-description">${recipe.description || recipe.summary || 'A delicious and healthy recipe'}</p>
        <div class="recipe-meta">
          <span class="time">${((recipe.prepTime || 0) + (recipe.cookTime || 0))} mins</span>
          <span class="difficulty ${((recipe.difficulty || 'Easy')).toLowerCase()}">${recipe.difficulty || 'Easy'}</span>
        </div>
        <div class="recipe-tags">
          ${(tagsArray || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <button class="view-recipe-btn btn btn-primary" data-recipe-id="${recipe._id || recipe.id}">
          View Recipe
        </button>
      </div>
    `;
    // store the recipe object on the element for quick lookup when falling back
    card._recipeData = recipe;
    return card;
  }

  // Event listeners for filter/sort/search and dynamic view buttons
  function attachEventListeners() {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        filterRecipes();
      });
    });

    sortButtons.forEach(button => {
      button.addEventListener('click', function() {
        sortButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        currentSort = this.getAttribute('data-sort');
        sortRecipes();
      });
    });

    searchInput?.addEventListener('input', function() {
      filterRecipes();
    });

    // FIXED: delegated handler for view buttons
    recipesGrid.addEventListener('click', function(e) {
      const btn = e.target.closest('.view-recipe-btn');
      if (!btn) return;
      const recipeId = btn.getAttribute('data-recipe-id');
      
      // find recipe by id in allRecipes
      const recipe = allRecipes.find(r => String(r._id || r.id) === String(recipeId));
      
      if (recipe) {
        // PROCESS THE RECIPE DATA BEFORE STORING
        const processedRecipe = processRecipeData(recipe);
        
        console.log('Sending recipe to detail:', processedRecipe.title);
        
        // store and navigate
        try { 
          sessionStorage.setItem('currentRecipe', JSON.stringify(processedRecipe)); 
        } catch (e) {
          console.error('Failed to store recipe in sessionStorage:', e);
        }
        
        window.location.href = 'recipe-detail.html';
      } else {
        // fallback: try to get recipe object from DOM nearest card
        const card = btn.closest('.recipe-card');
        const fallback = card?._recipeData;
        if (fallback) {
          const processedFallback = processRecipeData(fallback);
          try { 
            sessionStorage.setItem('currentRecipe', JSON.stringify(processedFallback)); 
          } catch (e) {
            console.error('Failed to store recipe in sessionStorage:', e);
          }
          window.location.href = 'recipe-detail.html';
        } else {
          alert('Recipe details not available.');
        }
      }
    });
  }

  // NEW FUNCTION: Process recipe data to ensure it has the right structure
  function processRecipeData(recipe) {
    if (!recipe) return null;
    
    // Process ingredients - convert from objects to strings if needed
    let ingredients = [];
    if (Array.isArray(recipe.ingredients)) {
      ingredients = recipe.ingredients.map(ing => {
        if (typeof ing === 'object' && ing.name && ing.quantity) {
          return `${ing.quantity} ${ing.name}`;
        }
        return ing;
      });
    } else {
      ingredients = ['Ingredients not available'];
    }
    
    // Process instructions
    let instructions = [];
    if (Array.isArray(recipe.instructions)) {
      instructions = recipe.instructions;
    } else {
      instructions = ['Instructions not available'];
    }
    
    // Process nutrition data - flatten for easy access
    const processedRecipe = {
      ...recipe,
      ingredients: ingredients,
      instructions: instructions,
      // Flatten nutrition data
      calories: recipe.nutrition?.calories || 'N/A',
      protein: recipe.nutrition?.protein || 'N/A',
      carbs: recipe.nutrition?.carbs || 'N/A',
      fat: recipe.nutrition?.fat || 'N/A',
      fiber: recipe.nutrition?.fiber || 'N/A'
    };
    
    return processedRecipe;
  }

  function filterRecipes() {
    const searchTerm = (searchInput?.value || '').toLowerCase();
    const cards = Array.from(document.querySelectorAll('.recipe-card'));
    cards.forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const description = (card.querySelector('.recipe-description')?.textContent || '').toLowerCase();
      const matchesFilter = currentFilter === 'all' || categories.includes(currentFilter);
      const matchesSearch = searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm);
      card.style.display = (matchesFilter && matchesSearch) ? 'block' : 'none';
    });
    sortRecipes();
  }

  function sortRecipes() {
    const visibleCards = Array.from(document.querySelectorAll('.recipe-card'))
      .filter(c => c.style.display !== 'none');
    visibleCards.sort((a, b) => {
      switch (currentSort) {
        case 'time':
          return parseInt(a.getAttribute('data-time') || '0') - parseInt(b.getAttribute('data-time') || '0');
        case 'calories':
          return parseInt(a.getAttribute('data-calories') || '0') - parseInt(b.getAttribute('data-calories') || '0');
        case 'optimized':
        default:
          return 0;
      }
    });
    visibleCards.forEach(card => recipesGrid.appendChild(card));
  }

});