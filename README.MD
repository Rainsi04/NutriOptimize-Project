# NutriOptimize 🥗

A smart nutrition and recipe optimization web application that delivers personalized meal recommendations based on your health profile, fitness goals, and medical conditions.

## Features

- **Personalized Recommendations** — Scores recipes 0–100 based on your age, gender, activity level, health goals, and medical conditions
- **Disease-Specific Meal Plans** — Curated recipe suggestions for Diabetes, Heart Disease, Hypertension, Fatty Liver, Kidney Disease, and PCOD/PCOS
- **Recipe Explorer** — Browse a full recipe library with detailed nutritional info, ingredients, and step-by-step instructions
- **AI Chatbot** — Built-in "Nutri ChatGPT" assistant for nutrition questions
- **Responsive Design** — Fully mobile-friendly interface

## Tech Stack

**Frontend:** HTML, CSS, JavaScript (Vanilla)

**Backend:** Node.js, Express.js

**Database:** MongoDB with Mongoose ODM

**Dev Tools:** Nodemon, dotenv

## Project Structure

```
NutriOptimize-Project/
├── Backend/
│   ├── controllers/
│   │   ├── diseaseController.js   # Disease-recipe matching logic
│   │   └── recipeController.js    # Recipe CRUD operations
│   ├── models/
│   │   ├── Disease.js             # Disease schema
│   │   └── Recipe.js              # Recipe schema with nutrition fields
│   ├── routes/
│   │   ├── diseaseRoutes.js
│   │   ├── recipeRoutes.js
│   │   └── recommendationRoutes.js  # Personalized scoring engine
│   ├── recipeDataset.js           # Sample recipe data
│   ├── seed.js                    # Database seeder
│   ├── server.js                  # Express app entry point
│   └── .env
└── Frontend/
    ├── css/
    ├── js/
    ├── images/
    ├── index.html
    ├── recipes.html
    ├── recipe-detail.html
    ├── recommendations.html
    ├── disease-recommendations.html
    └── chatbot.html
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nutrioptimize.git
   cd nutrioptimize/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `Backend/` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/nutrioptimize
   PORT=5000
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Production
   npm start

   # Development (with auto-reload)
   npm run dev
   ```

6. **Open the app**

   Visit `http://localhost:5000` in your browser. The backend serves the frontend static files automatically.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/recipes` | Get all recipes |
| GET | `/api/recipes/:id` | Get recipe by ID |
| GET | `/api/diseases` | Get all diseases |
| GET | `/api/diseases/:diseaseName/recipes` | Get recipes for a condition |
| POST | `/api/recommendations` | Get personalized recommendations |

### Recommendation Request Body

```json
{
  "age": 30,
  "sex": "female",
  "goal": "lose",
  "activity": "moderate",
  "diseases": ["diabetes", "heart"]
}
```

`goal` options: `lose`, `gain`, `muscle`, `maintain`

`activity` options: `sedentary`, `light`, `moderate`, `active`, `very-active`

## How Recommendations Work

Each recipe is assigned a score (0–100) using a weighted algorithm:

- **Base score:** 50
- **Health condition match:** +10 per matching beneficial tag, −15 per harmful tag
- **Goal alignment:** +8 per matching recipe tag
- **Calorie range fit:** +10 if within activity-level range
- **Demographics:** Small bonuses for age/gender-relevant tags
- **Restricted ingredients:** −30 penalty if recipe contains ingredients to avoid

The top 6 highest-scoring recipes are returned.

## Supported Medical Conditions

| Condition | Key Criteria |
|-----------|-------------|
| Diabetes | Low sugar, low carbs (≤35g), high fiber |
| Heart Disease | Low fat (≤15g), high fiber (≥7g) |
| Hypertension | Low sodium (≤400mg) |
| Fatty Liver | Low fat, detox-friendly |
| Kidney Disease | Low protein (≤20g), low sodium (≤350mg) |
| PCOD/PCOS | Low carbs (≤25g), anti-inflammatory |

## Recipe Schema

Recipes include: title, description, ingredients (with quantity/category), instructions, prep/cook time, servings, difficulty, image, and a `nutrition` object with calories, protein, carbs, fat, fiber, sugar, and sodium. Recipes are also tagged with `dietType`, `healthGoals`, `mealType`, `cuisine`, and `restrictions` arrays for flexible filtering.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
