const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    dietaryRestrictions: [{
        nutrient: String,
        condition: String, // 'max', 'min', 'avoid'
        value: Number
    }],
    recommendedFoods: [String],
    foodsToAvoid: [String],
    nutritionalGuidelines: String,
    image: String
});

module.exports = mongoose.model('Disease', diseaseSchema);