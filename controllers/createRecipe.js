module.exports = (req,res) => {
    res.render('create', {
        errors: req.flash('recipeErrors'),
        data: req.flash('data')[0] || {}
    })
}
