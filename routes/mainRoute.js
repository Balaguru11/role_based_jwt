const express = require('express')
const mainRouter = express.Router();

const bcrypt = require('bcrypt');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');

const database = require('../configuration/database');
const conn = database.connect();
const pushMail = require('../configuration/email.settings');

const {authentic} = require('../middlewares/auth');

// User registration Page GET
mainRouter.get('/register', (req, res) => {
    return res.render('components/register');
})

// User Registration POST
mainRouter.post('/register', async (req, res) => {
    try {
        const {role, email, mobile, username, password } = req.body;
        
        if(!(role && email && mobile && username && password)) {
            res.status(400).send('Please fill all the fields');
        }

        // checking old user aka duplicate entry
        const oldUser = await User.findOne({email})

        if(oldUser){
            return res.json({status: 'fail', msg: 'You already have an account. Please login'});
        } 
        
        // send email to the email with verification (create confirmation code)

        const verificationCode = Math.random().toString(36).slice(2, 8).toUpperCase();

        const hashedPass = bcrypt.hashSync(password, 10);
        
            const user = await User.create({
                role, email, mobile, username, password: hashedPass, verify_g: verificationCode, verify_status: 'Pending'
            })

            user_id = user._id

            if (user) {
                const verifyMail = await pushMail({
                    from: process.env.MAIL_USERNAME,
                    to: email,
                    subject: "Verify Your Account",
                    html: `<p>Your Verification Code is <b>${verificationCode}</b>. Please click on this <a href="./main/register-verify">link</a> to verify Now.</p>`
                }).then(result => {
                    return res.status(200).json({status: 'success', msg: 'Verification Code has been sent to the registered email id.', user: user})
                }).catch(err => {
                    return res.json({status: 'failure', msg: 'Error sending verification code email.'})
                })
            } else {
                return res.json({status: 'failure', msg: 'Error sending verification code email.'})
            }
    } catch (err) {
        console.log(err);
    }
})

// User Registration Verify email - GET
mainRouter.get('/register-verify', (req, res) => {
    try {
        const {user_id, verify_status} = req.body;
        // return res.render('')
    } catch(err) {
        console.log(err);
    }
})

// User Registration Verify email - POST
mainRouter.post('/register-verify', async (req, res) => {
    try {
        
        const {user_id, verification_code} = req.body;

        const userAcc = await User.findOne({_id: user_id})

        if (userAcc) {
            const verify_gen = userAcc.verify_g;
            if (userAcc.verify_status == 'Pending') {
                if(verify_gen != verification_code) {
                    return res.status(401).json({status: 'failure', msg: 'User Verification failed.'});    
                }
                const verifyUpdate = await User.updateOne({_id: user_id}, { $set: {
                    verify_status: "Verified",
                    }
                })
                return res.status(201).json({status: 'success', msg: 'User verified.' })
            } else {
                return res.json({status: 'Idle', msg: 'user already verified.'});
            }
        } else {
            return res.status(401).json({status: 'failure', msg: 'There is no user found'});
        }
    } catch (err) {
        console.log(err);
    }
})

// resend verification code - POST
mainRouter.post('/resend-verification-mail', async (req, res) => {
    try {
        const { user_id } = req.body;

        const findUser = await User.findOne({_id: user_id})
        if (findUser){
            if (findUser.verify_status != 'Pending') {
                return res.json({status: 'Idle', msg: 'Account already verified.'})
            }
            const newVerifyCode = Math.random().toString(36).slice(2, 8).toUpperCase();
            const updateAccStatus = await User.updateOne({_id: user_id}, { $set: {verify_g: newVerifyCode}})
            if (updateAccStatus) {
                    // mail the verification code and update the same in db
                const newVerifyMail = await pushMail({
                    from: process.env.MAIL_USERNAME,
                    to: email,
                    subject: 'New Verification code created.',
                    html: `<p>We have created a new Verification code for the account associated with this email id. The code is <b>${newVerifyCode}</b>. Please click on this <a href="./main/register-verify">link</a> to verify Now.</p>`
                }).then(result => {
                    return res.json({status: 'success', msg: 'Verification code has been sent to your mail id.'})
                }).catch(err => {
                    return res.json({status: 'failure', msg: 'Error sending verification code email.'})
                })
            } else {
                return res.json({status: 'failure', msg: 'There is an error while creating a new verification code.'})
            }
        } else {
            return res.json({status: 'failure', msg: 'Not a valid user.'})
        }
    } catch (err) {
        console.log(err);
    }
})

// User Login - GET
mainRouter.get('/login', (req, res) => {
    return res.render('components/login');    
})

// User Login - POST
mainRouter.post('/login', async (req, res) => {
    try {
        const {role, username, password} = req.body;
        const oldUser = await User.find({role: role, username: username})

        if (oldUser) {
            const passMatch = bcrypt.compareSync(password, oldUser[0].password);
            if (passMatch) {
                const token = jwt.sign({role, username}, process.env.TOKEN_KEY, {expiresIn: '2h'})
                oldUser.token = token;
                req.headers.authoization = token;
                return res.json({status: 'success', msg: 'User has been logged in'});
            } else {
                return res.json({status: 'fail', msg: 'No user match with the provided credential'});
            }
        } else {
            return res.json({status: 'fail', msg: 'No user match with the provided credential'});
        }
    } catch (err) {
        console.log(err);
    }
});

// role based profile
mainRouter.post('/my-profile', (req, res) => {

})

// authentication for role based routes
// my account

module.exports = mainRouter;