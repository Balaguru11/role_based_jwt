const express = require('express')
const userRoute = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const database = require('../configuration/database');
const conn = database.connect();
const pushMail = require('../configuration/email.settings');
const auth = require('../middlewares/auth')
const { check, validationResult } = require('express-validator');

// role based profile
userRoute.post('/my-profile', auth, (req, res) => {
    try {
        const user = req.user;
        if(user) {
            // create his/profile
        } 
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

// Password Reset // working on this controller
userRoute.put('/reset-password', auth, [check('new_pwd', 'Password must be 8 characters in length and should contain special characters as well.').isLength({min: 8}).not().isLowercase().not().isUppercase().not().isNumeric().not().isAlpha()], async (req, res) => {
    try {
        const {new_pwd, newMatch_pwd} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const user = req.user;
        if(user){
                if(new_pwd == newMatch_pwd) {
                    const hasedNew = bcrypt.hashSync(new_pwd, 10);
                    const changePwd = await User.updateOne({_id: user.user_id}, {$set: {password: hasedNew}});
                    if(changePwd){
                        return res.json({status: 'success', msg: 'Password changed successfully.'});
                    }
                    return res.json({status: 'failure', msg: 'Couldnt update the password at the moment.'})
                }
                return res.json({status: 'failure', msg: 'New Password doesnt match with confirm password.'});
        }
        return res.json({status: 'failure', msg: 'Please login', user})
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }  
})

// Performing logout Operation
userRoute.post('/logout', auth, async(req, res) => {
    try {
        const user = req.user;
        if(user){
            user.exp = user.iat;
            return res.json({status: 'success', msg: 'Logged out.'})
        }
        return res.json({status: 'failure', msg: 'You are not logged in.'}); 
    } catch (err) {
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

module.exports = userRoute;