const express = require('express')
const postsRouter = express.Router();
const auth = require('../middlewares/auth')
const Posts = require('../model/post.model');
const { post } = require('./authRoute');
const {check, validationResult} = require('express-validator')

// create Blog post route - Not available for students
postsRouter.get('/create-post', auth, (req, res) => {
    try {
        const user = req.user;
        if (user.role != 'Student') {
            return res.json({status: 'success', msg: 'You can create Blog Post'})
        }
        return res.json({status: 'failure', msg: 'Student cannot create Blog posts.'})
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

// create Post
postsRouter.post('/create-post', auth, [check('title', 'Post title should not be blank.').not().isEmpty(), check("visibility", 'Please Select the visibility options').not().isEmpty() ], async (req, res) => {
    try {
        const user = req.user;
        if(user.role != 'Student') {
            // publish post
            const {title, description, content, visibility} = req.body; //img, tags, keywords
    
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()})
            }
    
            let gen_desc = (!description) ? content.slice(0, 165) : description;
    
            let newPost = await Posts.create({title, description: gen_desc, content, created_by: user.user_id, visibility, deleted_at: 'Null'})
            post_id = newPost._id
            return res.json({status: 'success', msg: 'Post has been created successfully.', newPost});
        }
        return res.json({status: 'failure', msg: 'Student cannot create Blog Post.'});
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

//display Posts created by me.
postsRouter.get('/my-posts', auth, async (req, res) => {
    try {
        const user = req.user;
        if(!user){
            return res.json({status: 'failure', msg: 'Please login to continue'})
        }
    
        if( user.role != 'Student' ) {
            let posts = await Posts.find({created_by: user.user_id, deleted_at: 'Null'})
            return res.json({status: 'success', msg: 'Posts created by you.', posts: posts})
        }
        return res.json({status: 'failure', msg: 'You cant access this page'})  
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

// edit Post
postsRouter.get('/edit/:post_id', auth, async (req, res) => {
    try {
        const user = req.user;
        const post_id = req.params.post_id;
    
        let isMyPost = await Posts.findOne({_id: post_id, created_by: user.user_id, deleted_at: 'Null'});
    
        if(!isMyPost) {
            return res.json({status: 'failure', msg: 'You cannot edit post published from another account'})
        }
        return res.json({status: 'success', msg: 'Editing your Post'}); 
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

// Post Edit POST Route
postsRouter.put('/edit/:post_id', auth, [check('title', 'Post title should not be blank.').not().isEmpty(), check("visibility", 'Please Select the visibility options').not().isEmpty()], async(req, res) => {
    try {
        const user = req.user;
        const post_id = req.params.post_id;
    
        const {title, description, content, visibility} = req.body;
        let postData = await Posts.findOneAndUpdate({_id: post_id, created_by: user.user_id, deleted_at: 'Null'}, { $set: {title: title, description: description, content: content, visibility: visibility}});
        if(postData) {
            return res.json({status: 'success', msg: 'Post updated successfully.'})
        }
        return res.json({status: 'failure', msg: 'Post not updated.'})
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

// getting All Public Posts
postsRouter.get('/public', async (req, res) => {
    try {
        let posts = await Posts.find({visibility: 'Public', deleted_at: 'Null'});

        if(posts.length > 0) {
            res.json({status: 'success', msg: 'You are viewing all posts which are marked visible to Public', posts: posts})
        }
        return res.json({status: 'failure', msg: 'No Post available to display.'});  
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

// Getting Private Posts
postsRouter.get('/private', async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        if(!user){
            let posts = await Posts.find({visibility: 'Public', deleted_at: 'Null'})
            if(posts.length > 0) {
                return res.json({status: 'success', msg: 'Showing Public Posts only', posts: posts})
            } 
            return res.json({status: 'failure', msg: 'No post available to display.'})
        }
        
        let posts = await Posts.find({visibility: 'Private'})
        posts += await Posts.find({visibility: 'Public'})
    
        return res.json({status: 'success', msg: 'Showing Public and Private Posts', posts: posts});
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

postsRouter.delete('/delete/:post_id', auth, async (req, res) => {
    try {
        const user = req.user;
        const post_id = req.params.post_id;
        const isMyPost = await Posts.find({_id: post_id, created_by: user.user_id});
        if(isMyPost){
            const deleted = await Posts.updateOne({_id: post_id}, {$set: {deleted_at: new Date()}});
            if(deleted) {
                return res.json({status: 'success', msg: 'Post deleted successfully'})
            }
            return res.json({status: 'failure', msg: 'Couldnt delete the post.'})
        }
        return res.json({status: 'failure', msg: 'Post was not created by the loggedin user'})
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }
    
})

module.exports = postsRouter;


// add userRoute
// add try and catch for all blocks

