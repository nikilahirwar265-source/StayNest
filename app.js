const express = require("express");
const app = express();
const port = 8080;
const ejs = require('ejs');
const mongoose = require("mongoose");

// serve static file
const path = require("path");
app.use(express.static('public'));

// serve data for .env file
require('dotenv').config();

// this ejs-mate to common like footer and nav-bar use
const engine = require('ejs-mate');
app.engine('ejs', engine);
app.set("views engines", "ejs");

// importent multipal folder use inside the views
app.set("views", [
    path.join(__dirname, "views/listings"),
    path.join(__dirname, "views/users")
]);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const methodOverride = require('method-override');
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

const user = require('./models/User.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const flash = require('connect-flash');
// console.log(process.env.ATLASDB_URL);

// const store = MongoStore.create({
//     mongoUrl: process.env.Mongo_ATLAS,
//     crypto: {
//         secret: "keyboard cat"
//     },
//     touchAfter: 24 * 3600 // time period in seconds
// });
const sessionOptions = {

    secret: 'keyboard cat',
    expire: 10 * 24 * 60 * 60 * 1000,
    resave: false,
    saveUninitialized: true
}

// this is session middlware 
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.review = req.flash("review");
    res.locals.error = req.flash("error");
    res.locals.isLoggedIn = req.isAuthenticated();
    res.locals.CurrentUser = req.user;
    next();
});

//to access router file
const listings = require('./Router/listings.js');
const review = require('./Router/review.js');
const User = require('./Router/User.js');
const search = require('./Router/search.js');

// Express router middleware
app.use('/listing', listings);
app.use('/review', review);
app.use('/user', User);
app.use('/search', search);


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const MONGO_URL = process.env.ATLASDB_URL;

// main()
//     .then(() => {
//         console.log("MongoDB Connected");
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Connected");
    })
    .catch(err => {
        console.error("FULL ERROR:");
        console.error(err);
    });
app.use((req, res) => {
    res.status(404).send('the path does not exist');
});

// Hanling API error
app.use((err, req, res, next) => {
    res.render('error.ejs', { err });
    console.log(err);
});

app.listen(port, (req, res) => {
    console.log(`server is running ${port}`);

});





