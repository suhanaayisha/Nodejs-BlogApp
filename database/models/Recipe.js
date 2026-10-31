const mongoose = require('mongoose')

//what each doc in recipes collection should look like
const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: {
        type: [String],
        validate: list => list.length > 0
    },
    steps: {
        type: [String],
        validate: list => list.length > 0
    },
    prepTime: { type: Number, min: 0, default: 0 }, // minutes
    cookTime: { type: Number, min: 0, default: 0 }, // minutes
    servings: { type: Number, min: 1 },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

RecipeSchema.virtual('totalTime').get(function(){
    return (this.prepTime || 0) + (this.cookTime || 0)
})

//creating Recipe model, this is what is going to be communicating with db
//model represents collection
const Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe
