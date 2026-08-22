const User = require('../models/User.js');
const passport = require('passport');

// wrapAsync functions handle the error
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
}

// user signUp Form
module.exports.userSignUpForm = wrapAsync(async (req, res) => {
    res.render('signup.ejs');
});

// User Signup
module.exports.signUp = wrapAsync(async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const UserRegister = await User.register(user, password);
        req.logIn(UserRegister, function (err) {
            if (err) {
                return next(err);
            }
            req.flash("success", "User Successfully Register");
            res.redirect('/listing/');
        });

    } catch (err) {
        console.log(err.name);
        if (err.name === "UserExistsError") {
            req.flash("error", "User already exists");
            return res.redirect("/user/signup");
        }
    }
});

// User Login Form
module.exports.userLoignForm = wrapAsync(async (req, res) => {
    res.render('login.ejs');
});

// User Login 
module.exports.login = passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true
}),
    wrapAsync(async (req, res) => {
        req.flash('success', "Welcome back to Wanderlust");
        // res.send(`welcome ${req.user.username}`);
        res.redirect('/listing/');
    });

//  User destroy 
module.exports.userDestroy = async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect('/listing/');
    });

}