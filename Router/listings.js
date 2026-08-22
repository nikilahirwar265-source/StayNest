const express = require('express');
const router = express.Router();

const multer = require('multer');
const { storage, cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage });

const listings = require('../models/listing.js');
const { listingSchema, ReviewSchema } = require('../Validations/Joi.js');
const listingController = require("../controller/listings.js");


// Backend validation
const ListingValidates = async (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        res.status(404).send(errMsg);

    }
    else {
        next();
    }
}

// index route
router.get('/', listingController.index);

// listing about data
router.get('/:id', listingController.listingAboutData);

// add Listing Form
router.get('/add/data', listingController.addListingForm);

// add listing
router.post('/add/list', upload.single('image'), listingController.addListing);

//update  the listing data
router.get('/update/:id', ListingValidates, listingController.editListingForm);

// Edit listing
router.patch('/update/data', listingController.editListing);

// destroy Listing
router.get('/delete/:id', listingController.destroyListing);


module.exports = router;