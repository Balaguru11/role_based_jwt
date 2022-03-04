const express = require('express')
const postsRouter = express.Router();
const auth = require('../middlewares/auth')
const Posts = require('../model/post.model');
const { post } = require('./mainRoute');
const {check, validationResult} = require('express-validator')

// create Blog post route - Not available for students
postsRouter.get('/create-post', auth, (req, res) => {
    const user = req.user;
    
    if (user.role != 'Student') {
        return res.json({status: 'success', msg: 'You can create Blog Post'})
    }

    return res.json({status: 'failure', msg: 'Student cannot create Blog posts.'})
})

// create Post
postsRouter.post('/create-post', auth, [check('title', 'Post title should not be blank.').not().isEmpty() ], async (req, res) => {
    const user = req.user;
    if(user.role != 'Student') {
        // publish post
        const {title, description, content} = req.body;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        let gen_desc = (!description) ? content.slice(0, 165) : description;

        let newPost = await Posts.create({title, description: gen_desc, content, created_by: user.user_id})
        post_id = newPost._id
        return res.json({status: 'success', msg: 'Post has been created successfully.', newPost});
    }
    return res.json({status: 'failure', msg: 'Student cannot create Blog Post.'});
})

postsRouter.post('/public', (req, res) => {

})

module.exports = postsRouter;