const express = require('express');
const router = express.Router();
const { listingSchema, ReviewSchema } = require('../Validations/Joi.js');
const listings = require('../models/listing.js');
const review = require('../models/Review.js');

const reviewController = require("../controller/review.js");

// Backend Validation
const ReviewsValidates = async (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        res.status(404).send(errMsg);

    }
    else {
        next();
    }
}



// add reviews in database
router.post('/:id', ReviewsValidates, reviewController.addReview);

// delete the review
router.delete('/:reviewId/listings/:listingId', reviewController.destroyReview);

module.exports = router;