const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const verify = require('./verifyToken');
const User = require("../models/users")

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
        addedPost.author = postingUser;
        await addedPost.save()
        
        //save
        await postingUser.save()
        console.log('added new post to db ' + addedPost)
        console.log(postingUser)
        res.json({postId: addedPost._id})
    } catch(error) {
        console.log('error adding post to db: ' + error);
        res.json({postId: 0})
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
router.delete('/:id', verify, getPostById, async (req, res) => {
    try {
        //next find the user who is deleteing.
        //only logged in users can delete 
        const loggedInUser = await User.findById(req.user._id).exec();

        //find the index of the post in the users posts array
        const indexOfPost = loggedInUser.posts.indexOf(req.params.id)
        
        //if that post exist in the logged in users posts array
        //delete that post and remove that posts id from the users post array
        if (indexOfPost !== -1) {
            await res.foundPost.remove();
            loggedInUser.posts.splice(indexOfPost, 1)
            await loggedInUser.save()
        }

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