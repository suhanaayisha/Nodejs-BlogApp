// turns a textarea into a list, one item per non-empty line
const toLines = text => (text || '').split('\n').map(line => line.trim()).filter(Boolean)

module.exports = (req, res, next) => {
    req.body.ingredients = toLines(req.body.ingredients);
    req.body.steps = toLines(req.body.steps);

    const errors = [];
    if(!req.body.title || !req.body.title.trim()) errors.push('Please give your recipe a title');
    if(!req.body.description || !req.body.description.trim()) errors.push('Please add a short description');
    if(req.body.ingredients.length === 0) errors.push('Please list at least one ingredient');
    if(req.body.steps.length === 0) errors.push('Please add at least one step');
    if(!req.files || !req.files.image) errors.push('Please add a photo of the dish');

    if(errors.length > 0){
        req.flash('recipeErrors', errors);
        req.flash('data', {
            ...req.body,
            ingredients: req.body.ingredients.join('\n'),
            steps: req.body.steps.join('\n')
        });
        return res.redirect('/recipes/new')
    }

    next()
}
