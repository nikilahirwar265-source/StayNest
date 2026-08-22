const listings = require('../models/listing.js');
// wrapAsync functions handle the error
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
}

module.exports.searchBar = wrapAsync(async (req, res) => {

    const { location } = req.query;

    const products = await listings.find({
        $or: [
            { country: { $regex: location, $options: "i" } },
            { location: { $regex: location, $options: "i" } }
        ]
    });
    res.render("search.ejs", { products });
});
