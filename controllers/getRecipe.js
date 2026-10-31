const mongoose = require('mongoose');
const Recipe = require('../database/models/Recipe');

module.exports = async (request, response) => {
    const recipe = mongoose.isValidObjectId(request.params.id)
        ? await Recipe.findById(request.params.id).populate('author')
        : null;

    if(!recipe){
        return response.status(404).render('not-found');
    }

    response.render('recipe', {
        recipe
    })
}
