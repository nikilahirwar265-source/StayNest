const listings = require('../models/listing.js');
const review = require('../models/Review.js');

// wrapAsync functions handle the error
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
}

// add Review 
module.exports.addReview = wrapAsync(async (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash("review", "The review was added!");
        const { id } = req.params;
        const { rating, comment } = req.body;
        const reviewOwner = req.user._id;
        const reviewdata = await review.create({ rating, comment, reviewOwner });
        reviewdata.save();
        const reviewUser = await review.findById(reviewdata._id).populate("reviewOwner");
        const aboutData = await listings.find({ _id: id });
        const data1 = await listings.findById(id);
        data1.reviews.push(reviewdata._id);
        await data1.save();
        const data2 = await listings.findById(id).populate({
            path: "reviews", populate: {
                path: "reviewOwner"
            }
        });
        const reviews = data2.reviews;
        const data = await listings.findById(id).populate("owner");
        const owner = data.owner.id;
        const currentUser = req.user;
        res.render('listings.ejs', { aboutData, reviews, owner, currentUser });
    } else {
        res.render('login.ejs');
    }

})

// Destroy Review 
module.exports.destroyReview = wrapAsync(async (req, res, next) => {
    req.flash("review", "The review was deleted!");
    const { reviewId, listingId } = req.params;
    const reviewData = await review.findByIdAndDelete(reviewId);
    const listing = await listings.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
    res.redirect(`/listing/${listingId}`);
    6

})