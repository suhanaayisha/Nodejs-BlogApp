const path = require('path');
const Post = require('../database/models/Post');
const cloudinary = require('cloudinary').v2;

module.exports = async (request,response) => {
    const { image } = request.files;
    const fileName = `${Date.now()}-${path.basename(image.name)}`;
    const uploadPath = path.resolve(__dirname, '..','public/posts', fileName)

    let imageUrl = `/posts/${fileName}`;
    try {
        await image.mv(uploadPath);
        if (process.env.CLOUDINARY_NAME) {
            const result = await cloudinary.uploader.upload(uploadPath);
            imageUrl = result.secure_url;
        }
    } catch (error) {
        return response.redirect('/posts/new');
    }

    await Post.create({
        ...request.body,
        image: imageUrl,
        author: request.session.userId
    });

    response.redirect('/')
}
