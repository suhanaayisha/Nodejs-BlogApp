const mongoose = require('mongoose');
const Post = require('../database/models/Post');

module.exports = async (request, response) => {
    const post = mongoose.isValidObjectId(request.params.id)
        ? await Post.findById(request.params.id).populate('author')
        : null;

    if(!post){
        return response.status(404).render('not-found');
    }

    response.render('post', {
        post
    })
}
