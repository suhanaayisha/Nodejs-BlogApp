const Recipe = require('../database/models/Recipe');

// treat the search text literally, so characters like "(" or "*" can't break the query
const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = async (req,res) => {

    const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';

    let filter = {};
    if (q) {
        // every word has to appear somewhere in the title, description or ingredients
        filter.$and = q.split(/\s+/).map(word => {
            const pattern = new RegExp(escapeRegex(word), 'i');
            return { $or: [{ title: pattern }, { description: pattern }, { ingredients: pattern }] };
        });
    }

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 }).populate('author');

    res.render('index', {
        recipes,
        q
    })

}
