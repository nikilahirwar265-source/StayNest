const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User.js");

const ReviewSchema = new Schema({
    rating: Number,
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    reviewOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const review = mongoose.model('review', ReviewSchema);
module.exports = review;