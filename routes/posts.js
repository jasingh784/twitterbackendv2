const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const verify = require('./verifyToken');
const User = require("../models/Users")

//getting all posts
router.get('/', verify, async (req, res) => {               
    try {
        const foundPosts = await Post.find();
        //const resPosts = await foundPosts.json();
        res.send(foundPosts);
        
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
    
})

//getting one post 
router.get('/:id', getPostById, (req, res) => {
    res.json(res.foundPost)
})

//creating one post
router.post('/', verify, async (req, res) => {
    // console.log(req.body)
    // console.log(req.user)        
    try {
        //first create the post and add it to db
        const addedPost = await Post.create(req.body);

        //next find the user who is posting
        const postingUser = await User.findById(req.user._id).exec();

        //push the created post's id into the posting users post array. 
        //data association
        postingUser.posts.push(addedPost);
        
        //save
        await postingUser.save()
        console.log('added new post to db ' + addedPost)
        console.log(postingUser)
    } catch(error) {
        console.log('error adding post to db: ' + error);
    }
    
})

//updating one post    put vs patch
router.put('/:id', getPostById, async (req, res) => {
    console.log(res.foundPost)
    try {
        const updatedPostQuery = await Post.replaceOne({ _id: req.params.id }, req.body);
        const updatedPost = await Post.findById(req.params.id);
        res.json(updatedPost)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})


//deleting one post
router.delete('/:id', getPostById, async (req, res) => {
    try {
        await res.foundPost.remove()
        res.json({message: 'deleted post'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//MIDDLEWARE
async function getPostById(req, res, next) {
    console.log("inside middleware")
    let foundPost
    try {
        foundPost = await Post.findById(req.params.id).exec();
        if (foundPost == null) {
            return res.status(404).json({message: 'Cannot find post'})
        }
        console.log(foundPost)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.foundPost = foundPost
    next()
}
module.exports = router;