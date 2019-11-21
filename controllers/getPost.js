const Post = require('../database/models/Post');

module.exports = async (request, response) => {
    const post = await Post.findById(request.params.id).populate('author');

    response.render('post', {
        post
    })
}