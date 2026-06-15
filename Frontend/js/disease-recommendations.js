// Frontend/js/disease-recommendations.js

class DiseaseRecommendations {
    constructor() {
        this.diseases = [];
        this.currentDisease = null;
        this.BACKEND_URL = 'http://localhost:5000';
        this.init();
    }

    async init() {
        this.bindElements();
        await this.loadDiseases();
        this.setupEventListeners();
    }

    bindElements() {
        this.el = {
            diseaseGrid: document.getElementById('diseaseGrid'),
            diseaseInfo: document.getElementById('diseaseInfo'),
            diseaseName: document.getElementById('diseaseName'),
            diseaseDescription: document.getElementById('diseaseDescription'),
            recommendedFoods: document.getElementById('recommendedFoods'),
            foodsToAvoid: document.getElementById('foodsToAvoid'),
            recipesContainer: document.getElementById('recipesContainer'),
            recommendedRecipesSection: document.getElementById('recommendedRecipes'),
            guidelinesText: document.getElementById('guidelinesText')
        };
        
        console.log('Elements bound:', this.el);
    }

    async loadDiseases() {
        try {
            console.log('Loading diseases from API...');
            const response = await fetch(`${this.BACKEND_URL}/api/diseases`);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.diseases = data;
            console.log('Diseases loaded:', this.diseases.length);
            this.renderDiseases();
        } catch (error) {
            console.warn('Failed to load diseases:', error);
            this.useFallbackData();
        }
    }

    useFallbackData() {
        console.log('Using fallback disease data');
        this.diseases = [
            {
                _id: '1',
                name: 'Fatty Liver',
                slug: 'fatty-liver',
                description: 'Recipes low in fat and high in fiber to support liver health',
                recommendedFoods: ['Leafy greens', 'Whole grains', 'Lean proteins', 'Fruits'],
                foodsToAvoid: ['Fried foods', 'Sugary drinks', 'Processed foods', 'Alcohol'],
                nutritionalGuidelines: 'Focus on high-fiber, low-fat foods with plenty of antioxidants'
            },
            {
                _id: '2',
                name: 'Diabetes',
                slug: 'diabetes',
                description: 'Low glycemic index recipes to manage blood sugar levels',
                recommendedFoods: ['Non-starchy vegetables', 'Whole grains', 'Lean proteins', 'Healthy fats'],
                foodsToAvoid: ['Refined sugars', 'White bread', 'Sweetened beverages', 'Processed snacks'],
                nutritionalGuidelines: 'Balance carbohydrates with protein and fiber to maintain stable blood sugar'
            },
            {
                _id: '3',
                name: 'Hypertension',
                slug: 'hypertension',
                description: 'Low-sodium, heart-healthy recipes to manage blood pressure',
                recommendedFoods: ['Fresh vegetables', 'Fruits', 'Low-fat dairy', 'Whole grains'],
                foodsToAvoid: ['Processed foods', 'Canned goods', 'Salty snacks', 'Fast food'],
                nutritionalGuidelines: 'Reduce sodium intake and increase potassium-rich foods'
            },
            {
                _id: '4',
                name: 'Heart Disease',
                slug: 'heart-disease',
                description: 'Low-cholesterol recipes for cardiovascular health',
                recommendedFoods: ['Oats', 'Fatty fish', 'Nuts', 'Berries', 'Leafy greens'],
                foodsToAvoid: ['Red meat', 'Butter', 'Fried foods', 'Full-fat dairy'],
                nutritionalGuidelines: 'Focus on heart-healthy fats and high-fiber foods'
            },
            {
                _id: '5',
                name: 'Kidney Disease',
                slug: 'kidney-disease',
                description: 'Low-potassium and controlled protein recipes for kidney health',
                recommendedFoods: ['Apples', 'Berries', 'Cabbage', 'Cauliflower', 'Lean chicken'],
                foodsToAvoid: ['Bananas', 'Potatoes', 'Tomatoes', 'Oranges', 'Processed meats'],
                nutritionalGuidelines: 'Control protein, potassium, and sodium intake'
            },
            {
                _id: '6',
                name: 'PCOD/PCOS',
                slug: 'pcod',
                description: 'Low-carb, anti-inflammatory recipes for hormonal balance',
                recommendedFoods: ['Lean proteins', 'Healthy fats', 'Non-starchy vegetables', 'Berries'],
                foodsToAvoid: ['Refined carbs', 'Sugary foods', 'Processed foods', 'Dairy (for some)'],
                nutritionalGuidelines: 'Focus on low-glycemic foods and anti-inflammatory ingredients'
            }
        ];

        this.renderDiseases();
    }

    renderDiseases() {
        if (!this.el.diseaseGrid) {
            console.error('diseaseGrid element not found!');
            return;
        }

        if (!this.diseases.length) {
            console.warn('No diseases to render');
            return;
        }

        console.log('Rendering disease cards:', this.diseases.length);
        this.el.diseaseGrid.innerHTML = this.diseases
            .map(disease => this.createDiseaseCard(disease))
            .join('');
    }

    createDiseaseCard(disease) {
        return `
            <div class="disease-card" data-disease="${disease.slug}">
                <div class="disease-card-content">
                    <h3>${disease.name}</h3>
                    <p>${disease.description || ''}</p>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        if (this.el.diseaseGrid) {
            this.el.diseaseGrid.addEventListener('click', (event) => {
                const card = event.target.closest('.disease-card');
                if (!card) return;
                
                const slug = card.dataset.disease;
                console.log('Disease selected:', slug);
                this.onSelectDisease(slug, card);
            });
        } else {
            console.error('diseaseGrid not found for event listeners');
        }
    }

    onSelectDisease(slug, card) {
        if (!slug) return;

        // Update active state
        document.querySelectorAll('.disease-card').forEach(card => {
            card.classList.remove('active');
        });
        card.classList.add('active');

        // Show disease info section
        if (this.el.diseaseInfo) {
            this.el.diseaseInfo.style.display = 'block';
            console.log('Showing disease info section');
        }

        // Find and display disease info
        const disease = this.diseases.find(d => d.slug === slug);
        if (disease) {
            this.currentDisease = disease;
            this.displayDiseaseInfo();
        } else {
            console.warn('Disease not found:', slug);
        }

        // Load recipes for this disease
        this.loadRecipes(slug);
    }

    async loadRecipes(slug) {
        console.log('Loading recipes for:', slug);
        // Show loading state
        this.showLoadingRecipes();

        try {
            const response = await fetch(`${this.BACKEND_URL}/api/diseases/${slug}/recipes`);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const recipes = await response.json();
            console.log('Recipes loaded:', recipes.length);
            
            // Display recipes (API returns just the recipes array)
            this.displayRecipes(recipes || []);
        } catch (error) {
            console.error('Failed to load recipes:', error);
            this.showErrorRecipes();
        }
    }

    showLoadingRecipes() {
        if (!this.el.recipesContainer) {
            console.error('recipesContainer not found');
            return;
        }
        
        this.el.recipesContainer.innerHTML = `
            <div class="loading">
                <p>Loading recipes...</p>
            </div>
        `;
        
        if (this.el.recommendedRecipesSection) {
            this.el.recommendedRecipesSection.style.display = 'block';
            console.log('Showing recipes section');
        }
    }

    showErrorRecipes() {
        if (!this.el.recipesContainer) return;
        
        this.el.recipesContainer.innerHTML = `
            <div class="error">
                <p>Failed to load recipes. Please try again.</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
    }

    displayDiseaseInfo() {
        if (!this.currentDisease) {
            console.warn('No current disease to display');
            return;
        }

        const disease = this.currentDisease;
        console.log('Displaying disease info:', disease.name);
        
        // Update disease name and description
        if (this.el.diseaseName) {
            this.el.diseaseName.textContent = disease.name || '';
        } else {
            console.error('diseaseName element not found');
        }
        
        if (this.el.diseaseDescription) {
            this.el.diseaseDescription.textContent = disease.description || '';
        }

        // Update food lists
        if (this.el.recommendedFoods) {
            this.el.recommendedFoods.innerHTML = (disease.recommendedFoods || [])
                .map(food => `<li>${food}</li>`)
                .join('');
        } else {
            console.error('recommendedFoods element not found');
        }

        if (this.el.foodsToAvoid) {
            this.el.foodsToAvoid.innerHTML = (disease.foodsToAvoid || [])
                .map(food => `<li>${food}</li>`)
                .join('');
        } else {
            console.error('foodsToAvoid element not found');
        }

        // Update nutritional guidelines
        if (this.el.guidelinesText) {
            this.el.guidelinesText.textContent = disease.nutritionalGuidelines || '';
        } else {
            console.error('guidelinesText element not found');
        }
    }

    displayRecipes(recipes) {
    window.currentRecipes = recipes;
    if (!this.el.recipesContainer) {
        console.error('recipesContainer not found');
        return;
    }

    if (!this.el.recommendedRecipesSection) {
        console.error('recommendedRecipesSection not found');
        return;
    }

    console.log('Displaying recipes:', recipes.length);

    if (!recipes.length) {
        this.el.recipesContainer.innerHTML = `
            <div class="no-recipes">
                <p>No recipes found for this condition.</p>
            </div>
        `;
        return;
    }

    this.el.recipesContainer.innerHTML = recipes
        .map((recipe, index) => this.createRecipeCard(recipe, index))
        .join('');

    this.el.recommendedRecipesSection.style.display = 'block';
}
// ALTERNATIVE SIMPLER FIX - Store recipe in global variable and pass index
createRecipeCard(recipe, index) {
    const calories = recipe.nutrition?.calories || recipe.calories || 'N/A';
    const prepTime = recipe.prepTime || 'N/A';
    const protein = recipe.nutrition?.protein || 'N/A';
    const carbs = recipe.nutrition?.carbs || 'N/A';
    const title = recipe.title || recipe.name || 'Untitled Recipe';

    return `
        <div class="recipe-card" onclick="viewRecipeByIndex(${index})">
            <div class="recipe-image">
                ${recipe.image ? `<img src="images/${recipe.image}" alt="${title}" onerror="this.style.display='none'">` : ''}
            </div>
            <div class="recipe-info">
                <h3>${title}</h3>
                <p class="recipe-description">${recipe.description || 'Healthy and delicious recipe'}</p>
                
                <div class="recipe-meta">
                    <span class="calories"><strong>Calories:</strong> ${calories}</span>
                    <span class="protein"><strong>Protein:</strong> ${protein}g</span>
                    <span class="carbs"><strong>Carbs:</strong> ${carbs}g</span>
                    <span class="prep-time"><strong>Prep:</strong> ${prepTime} min</span>
                </div>
                
                <div class="recipe-tags">
                    ${(recipe.tags || []).slice(0, 3).map(tag => 
                        `<span class="tag">${tag}</span>`
                    ).join('')}
                </div>
                
                <button class="view-recipe-btn">View Recipe</button>
            </div>
        </div>
    `;
}
    createSlug(text) {
        return text.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
}
function viewRecipeByIndex(index) {
    const recipe = window.currentRecipes[index];
    if (recipe) {
        sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
        window.location.href = 'recipe-detail.html';
    }
}
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing DiseaseRecommendations...');
    new DiseaseRecommendations();
});