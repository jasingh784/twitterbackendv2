const express = require('express');
const router = express.Router();
const Post = require('../models/posts');

//getting all posts
router.get('/', async (req, res) => {               
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
router.post('/', async (req, res) => {
    console.log(req.body)        
    try {
        const addedPost = await Post.create(req.body);
        console.log('added new post to db ' + addedPost)
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