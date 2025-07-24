const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.addReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewid } = req.params;

    try {
        // Remove the review from the listing
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
        // Delete the review
        await Review.findByIdAndDelete(reviewid);

        req.flash("success", "Review Deleted");
    } catch (error) {
        req.flash("failure", "Error deleting review");
        console.error(error);
    }
    
    res.redirect(`/listings/${id}`);
};
