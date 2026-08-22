const express = require('express');
const router = express.Router();

const User = require('../models/User.js');
const passport = require('passport');
const userController = require("../controller/user.js");

// wrapAsync functions handle the error
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
}

// user signUp Form
router.get('/signup', userController.userSignUpForm);

// User Signup
router.post('/signup', userController.signUp);

// User Login Form
router.get('/login', userController.userLoignForm);

// User Login 
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true
}),
    wrapAsync(async (req, res) => {
        req.flash('success', "Welcome back to Wanderlust");
        // res.send(`welcome ${req.user.username}`);
        res.redirect('/listing/');
    }));

//  User destroy 
router.get('/logout', userController.userDestroy);



module.exports = router;
