const listings = require('../models/listing.js');
// wrapAsync functions handle the error
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
}

// index route
module.exports.index = wrapAsync(async (req, res) => {


    await listings.find({}).then(result => {
        const allData = result;
        res.render('show.ejs', { allData });
    });
})

// listing about data
module.exports.listingAboutData = wrapAsync(async (req, res, next) => {
    if (req.isAuthenticated()) {
        const { id } = req.params;
        const data = await listings.findById(id).populate("owner");

        const owner = data.owner.id;
        const currentUser = req.user;
        const data2 = await listings.findById(id).populate({
            path: "reviews", populate: {
                path: "reviewOwner"
            }
        });
        const reviews = data2.reviews;
        await listings.find({ _id: id }).then((aboutData) => {
            // console.log("data show ", aboutData);

            res.render('listings.ejs', { aboutData, reviews, currentUser, owner });
        }).catch((err) => {
            res.send(listings);
        });
    } else {
        res.render('login.ejs');
    }

})

// add Listing Form
module.exports.addListingForm = wrapAsync(async (req, res) => {
    if (req.isAuthenticated()) {
        res.render('add.ejs');
    } else {
        res.render('login.ejs');
    }

})

// add listing
module.exports.addListing = wrapAsync(async (req, res) => {
    req.flash("success", "The listing was added");
    const owner = req.user._id;
    console.log(req.file.path);
    const url = req.file.path;
    const filename = req.file.filename;
    const { title, description, price, location, country, image } = req.body;

    await listings.insertMany({
        title: title,
        description: description,
        image: { filename: filename, url: url },
        price: price,
        location: location,
        country: country,
        owner: owner
    }).then((result) => {
        // console.log("data was inserted", result);
        res.redirect('/listing/');
    }).catch((err) => {
        console.log('some error occured please debug this', err);
        res.send(listings);
    });
});

// edit listing form
module.exports.editListingForm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listings.find({ _id: id }).then((Data) => {
        // console.log(`data is`, Data);
        res.render('update.ejs', { Data });

    }).catch((err) => {
        res.send(listings);
    });


})

// Edit listing
module.exports.editListing = wrapAsync(async (req, res) => {
    req.flash("success", "The listing was Updated!");
    const { id } = req.query;
    const { title, description, price, location, country } = req.body;
    await listings.findByIdAndUpdate(id, { title, description, price, location, country }).then((data) => {
        // console.log('the data was updated', data);
        res.redirect('/listing/');

    }).catch((err) => {
        console.log('the data was not updated', err);
        res.send(listings);

    });
})

// destroy Listing
module.exports.destroyListing = wrapAsync(async (req, res) => {
    req.flash("success", "The listing was deleted!");
    const { id } = req.params;
    await listings.findByIdAndDelete(id, {}).then((Data) => {
        // console.log('the data was deleted', data);
        res.redirect('/listing/');

    }).catch((err) => {
        res.send(listings);
    });


})