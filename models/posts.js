const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postText: {
        required: false,
        type: String,
    },
    author: {type: mongoose.Schema.ObjectId, ref: "User"},
    mediaUrl: {type: String}
},
    {
        timestamps: true,

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;