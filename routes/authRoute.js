const express = require('express')
const mainRouter = express.Router();

const bcrypt = require('bcrypt');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');

const database = require('../configuration/database');
const conn = database.connect();
const pushMail = require('../configuration/email.settings');
const auth = require('../middlewares/auth')
const { check, validationResult } = require('express-validator');
const {reverseString} = require('../helpers/authorize')

// User registration Page GET
mainRouter.get('/register', (req, res) => {
    return res.render('components/register');
})

// User Registration POST
mainRouter.post('/register', [
    check('email', 'Email is not valid.').isEmail(), check('username', 'Username should be lowercase.').isLowercase(), check('password', 'Password must be 8 characters in length and should contain special characters as well.').isLength({min: 8}).not().isLowercase().not().isUppercase().not().isNumeric().not().isAlpha(), check('mobile', 'Not a vaild Mobile number. Mobile number should be 10 characters in length.').isNumeric().isLength(10), check('role', 'Role cannot not be empty.').notEmpty()
], async (req, res) => {
    try {
        const {role, email, mobile, username, password } = req.body;

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
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
                role, email, mobile, username, password: hashedPass, verify_g: verificationCode, verify_status: 'Pending', deleted_at: 'Null'
            })

            user_id = user._id

            if (user) {
                const verifyMail = await pushMail({
                    from: process.env.MAIL_USERNAME,
                    to: email,
                    subject: "Verify Your Account",
                    html: `<p>Your Verification Code is <b>${verificationCode}</b>. Please click on this <a href="./auth/register-verify">link</a> to verify Now.</p>`
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
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

// User Registration Verify email - GET
mainRouter.get('/register-verify', (req, res) => {
    try {
        const {user_id, verify_status} = req.body;
        // return res.render('')
    } catch(err) {
        console.log(err);
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

// User Registration Verify email - POST
mainRouter.post('/register-verify', async (req, res) => {
    try {
        const {user_id, verification_code} = req.body;
        const userAcc = await User.findOne({_id: user_id, deleted_at: 'Null'})

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
                const role = userAcc.role;
                const token = jwt.sign({role, user_id}, process.env.TOKEN_KEY, {expiresIn: '2h'})
                userAcc.token = token;
                req.headers.authorization = token;
                return res.status(201).json({status: 'success', msg: 'User verified.' })
            } else {
                return res.json({status: 'Idle', msg: 'user already verified.'});
            }
        } else {
            return res.status(401).json({status: 'failure', msg: 'There is no user found'});
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

// resend verification code - POST
mainRouter.post('/resend-verification-mail', async (req, res) => {
    try {
        const { user_id } = req.body;

        const findUser = await User.findOne({_id: user_id, deleted_at: 'Null'})
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
        return res.json({status: 'error', message: 'We caught an error'});
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
        const oldUser = await User.findOne({role: role, username: username, deleted_at: 'Null'})
        if (oldUser && oldUser.verify_status == 'Verified') {
            const user_id = oldUser._id;
            const passMatch = bcrypt.compareSync(password, oldUser.password);
            if (passMatch) {
                const token = jwt.sign({role, user_id}, process.env.TOKEN_KEY, {expiresIn: '2h'})
                oldUser.token = token;
                req.headers.authoization = token;                
                return res.json({status: 'success', msg: 'User has been logged in', token});
            } else {
                return res.json({status: 'fail', msg: 'No user match with the provided credential'});
            }
        } else if (oldUser && oldUser.verify_status == 'Pending'){
            return res.json({status: 'fail', msg: 'Your account not verified yet.'});
        } else {
            return res.json({status: 'fail', msg: 'No account found.'});
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 'error', message: 'We caught an error'});
    }
});

// FIRST TRY OF RESET PASSWORD 186 - 275
// registered email >> verification code >> verifing code and useracc >> submission new pass, match pass.
mainRouter.post('/forget-password', [check('email', 'Email is not valid').isEmail(), check('username', 'Username should be lowercase.').isLowercase()], async (req, res, next) => {
    try {
        const {email} = req.body;
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.json({status: 'failure', errors: error.array()})
        }

        const isAcc = await User.findOne({email: email, verify_status: 'Verified', deleted_at: 'Null'})
        if (!isAcc) {
            return res.json({status: 'failure', message: 'No Active account found with provided email id.'})
        }
        // hashing email and sending as url params
        const reversedMail = reverseString(email);
        const hasedVerifyCode = bcrypt.hashSync(reversedMail, 10) +'&&'+ isAcc._id;
        const encodedHashCode = encodeURIComponent(hasedVerifyCode);
        const emailVerify = await pushMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "Email Verification Code",
            html: `<p>You requested for a password reset, kindly use <a href="./auth/reset-password/${encodedHashCode}">this link</a> to reset your password.</p>`
        }).then(result => {
            return res.json({status: 'success', message: 'Your email verification code has been sent.', encodedHashCode});
        }).then(result => {
            req.email = email;
            next();
        }).catch(err => {
            return res.json({status: 'error', messsage: 'Error sending email verification code.', err})
        })
    } catch (error) {
        console.log(error);
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

//verifying code and useracc
mainRouter.get('/reset-password/:verify_code', async(req, res) => {
    try {
        const primaryString = decodeURIComponent(req.params.verify_code);
        const user_id = primaryString.split("&&")[1];
        const verifyUser = primaryString.split("&&")[0];

        const ifUser = await User.findById(user_id)
        if(!ifUser) {
            return res.json({status: 'error', message: 'You are not a valid user'});
        }
        const reverseEmail = reverseString(ifUser.email);
        const compareHash = bcrypt.compareSync(verifyUser, reverseEmail);

        if (!compareHash) {
            return res.json({status: 'error', message: 'Url validation failed. Not a valid URL.'})
        }

        return res.json({status: 'success', message: 'Please enter your new password.'})
    } catch (err) {
        console.log(err);
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

mainRouter.post('/reset-password/:verify_code', [check('new_pwd', 'Password must be 8 characters in length and should contain special characters as well.').isLength({min: 8}).not().isLowercase().not().isUppercase().not().isNumeric().not().isAlpha()], async(req, res) => {
    try {
        const {new_pwd, new_match_pwd} = req.body;
        const error = validationResult(req);
        if(!error.isEmpty()) {
            return res.json({status: 'error', error: error.array()})
        }

        const primaryString = req.params.verify_code;
        const user_id = primaryString.split("&&")[1];

        if (new_pwd == new_match_pwd) {
            const updatePwd = await User.updateOne({_id: user_id, deleted_at: 'Null', verify_status: 'Verified'}, {$set: {password: new_pwd}});
            if(updatePwd) {
                return res.json({status: 'success', message: 'Kudos, Your Account Password has been updated.'})
            }
            return res.json({status: 'failure', message: 'We couldnt update the password at the moment.'})
        }

        return res.json({status: 'failure', message: 'New Password doesnt match with confirm password.'})

    } catch (err) {
        console.log(err);
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

// authentication for role based routes
// my account

// TRY 2 - SUPPORT DOC: https://www.smashingmagazine.com/2017/11/safe-password-resets-with-json-web-tokens/
mainRouter.post('/forgot-password', [check('email', 'Email is not valid').isEmail(), check('username', 'Username should be lowercase.').isLowercase()], async (req, res, next) => { 
    try {
        const {email} = req.body;
        const error = validationResult(req);
        if(!error.isEmpty()) {
            return res.json({status: 'failure', errors: error.array()})
        }

        const findAcc = await User.findOne({email: email, deleted_at: 'Null'})
        if(!findAcc){
            return res.json({status: 'failure', message: 'No Active account found with provided email id.'})
        }

        let payload = {id: findAcc._id, email: email}
        const pwdResetSecret = findAcc.password + '-' + findAcc.createdAt.getTime();

        const resetToken = jwt.sign(payload, pwdResetSecret);

        const emailVerify = await pushMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "Email Verification Code",
            html: `<p>You requested for a password reset, kindly use <a href="./auth/reset-password/${findAcc._id}/${resetToken}">this link</a> to reset your password.</p>`
        }).then(result => {
            return res.json({status: 'success', message: 'A link to Reset your account Password has been mailed to you.', resetToken});
        }).then(result => {
            req.email = email;
            next();
        }).catch(err => {
            return res.json({status: 'error', messsage: 'Error sending email verification code.', err})
        })
    } catch (err) {
        console.log(err);
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

mainRouter.get('/reset-password/:user_id/:resetToken', async(req, res) => {
    try {
        const user_id = req.params.user_id;
        const resetToken = req.params.resetToken;

        const userAcc = await User.findOne({_id: user_id, deleted_at: 'Null'})

        if(!userAcc) {
            return res.json({status: 'error', message: 'You are not a valid user'});
        }

        const secretFromDb = userAcc.password + '-' + userAcc.createdAt.getTime();

        jwt.verify(resetToken, secretFromDb, (err, response) => {
            if(err){
                return res.json({status: 'error', message: 'There is an error.', err, resetToken, secretFromDb})
            } else if(response.id != user_id ) {
                // console.log(response.id);
                return res.json({status: 'failure', message: 'Invalid Reset Link'});
            } else {
                return res.json({status: 'success', message: 'User found. Please enter your New Password.'})
            }
        });
    } catch (err) {
        console.log(err);
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

mainRouter.post('/reset-password/:user_id/:resetToken', [check('new_pwd', 'Password must be 8 characters in length and should contain special characters as well.').isLength({min: 8}).not().isLowercase().not().isUppercase().not().isNumeric().not().isAlpha()], async(req, res) => {
    try {
        const user_id = req.params.user_id;
        const resetToken = req.params.resetToken;
        const {new_pwd, new_match_pwd} = req.body;
        const error = validationResult(req);
        if(!error.isEmpty()) {
            return res.json({status: 'error', error: error.array()})
        }

        const userAcc = await User.findOne({_id: user_id, deleted_at: 'Null' })
        if(!userAcc){
            return res.json({status: 'failure', message: 'User not found'})
        }

        const secretFromDb = userAcc.password + '-' + userAcc.createdAt.getTime();

        var payload = jwt.verify(resetToken, secretFromDb);

        if(!payload || !(payload.id == user_id) ) {
            return res.json({status: 'failure', message: 'Invalid Reset Link'});
        }

        const compareOldAndNewPwd = bcrypt.compareSync(new_pwd, userAcc.password);

        if(compareOldAndNewPwd) {
            return res.json({status: 'failure', message: 'It seems you have used this Password already.'})
        }

        if(!(new_pwd == new_match_pwd)) {
            return res.json({status: 'failure', message: 'New password and confirm password doesnot match.'});
        }

        const hashedNewPwd = bcrypt.hashSync(new_pwd, 10);
        
        const updatePwd = await User.updateOne({_id: user_id}, {$set: {password: hashedNewPwd}})
        if(!updatePwd) {
            return res.json({status: 'failure', message: 'Password not changed.'})
        }
        // Changing / reverting pwd change, from notification email
        const pwdResetSecret = userAcc.password + '-' + userAcc.createdAt.getTime();
        const newVerifyToken = jwt.sign(payload, pwdResetSecret);

        // sending mail to registered mail id
        const notifyPwdChange = await pushMail({
            from: process.env.MAIL_USERNAME,
            to: userAcc.email,
            subject: 'Your Account Password Changed',
            html: `<p>Your Password has been changed recently. If you didn't change the Password, please click <a href="./auth/reset-password/${userAcc._id}/${newVerifyToken}">this link</a> to revert or change the password again.</p>`
        }).then(result => {
            return res.json({status: 'success', message: 'Password has been changed successfully.'})
        }).catch(err => {
            return res.json({status: 'error', messsage: 'Email sending failed.', err})
        })
    } catch (err) {
        console.log(err);
        return res.json({status: 'error', message: 'We caught an error'});
    }
})

module.exports = mainRouter;