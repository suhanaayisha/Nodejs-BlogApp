const mongoose = require('mongoose')

//what each doc in post collection should look like
const PostSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    content: String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

//creating Post model, this is what is going to be communicating with db
//model represents collection
const Post = mongoose.model('Post', PostSchema)

module.exports = Post
