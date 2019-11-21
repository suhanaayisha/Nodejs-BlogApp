const path = require('path');
const Post = require('../database/models/Post');
const cloudinary = require('cloudinary');

module.exports = (request,response) => {
    const { image } =request.files;
    const uploadPath = path.resolve(__dirname, '..','public/posts', image.name)
    image.mv(uploadPath, (error) => {
        cloudinary.v2.uploader.upload(uploadPath, (error, result) => {
            if(error){

                return response.redirect('/posts/new');
            }
            Post.create({
                ...request.body,
                image: result.secure_url,
                author: request.session.userId
            }, (error, post) => {

                response.redirect('/')
            })
        });
        
    })
    
}