const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{isAuthor}=require("../middleware.js")
const{isLoggedIn}=require("../middleware.js")
const reviewController = require("../controllers/review.js")

// =================== REVIEWS =================== //
// Validation middleware for review
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((el) => el.message);
        req.flash("failure", messages);
        // redirect back to the form the user came from
        return res.redirect("back");  // or use specific route like `/listings/:id`
    } else {
        next();
    }
};


// Route to create new review for a listing
router.post("/listings/:id/reviews",isLoggedIn, validateReview, wrapAsync(reviewController.addReview));

// Route to delete a review from a listing
router.delete("/listings/:id/reviews/:reviewid", isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview));
module.exports = router;