const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postText: {
        required: true,
        type: String,
    },
    author: {type: mongoose.Schema.ObjectId, ref: "User"},
},
    {
        timestamps: true,

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;