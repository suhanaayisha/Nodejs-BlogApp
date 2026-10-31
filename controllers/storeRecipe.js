const path = require('path');
const Recipe = require('../database/models/Recipe');
const cloudinary = require('cloudinary').v2;

module.exports = async (request,response) => {
    const { image } = request.files;
    const fileName = `${Date.now()}-${path.basename(image.name)}`;
    const uploadPath = path.resolve(__dirname, '..','public/recipes', fileName)

    let imageUrl = `/recipes/${fileName}`;
    try {
        await image.mv(uploadPath);
        if (process.env.CLOUDINARY_NAME) {
            const result = await cloudinary.uploader.upload(uploadPath);
            imageUrl = result.secure_url;
        }
    } catch (error) {
        return response.redirect('/recipes/new');
    }

    const { title, description, ingredients, steps, prepTime, cookTime, servings } = request.body;
    const recipe = await Recipe.create({
        title,
        description,
        ingredients,
        steps,
        prepTime: prepTime || 0,
        cookTime: cookTime || 0,
        servings: servings || undefined,
        image: imageUrl,
        author: request.session.userId
    });

    response.redirect(`/recipes/${recipe._id}`)
}
