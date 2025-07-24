const Listing = require("./models/listing");
const Review = require("./models/review");

// Check if user is logged in, else redirect to login page with flash message
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Save the original url to redirect after login
    req.session.redirectUrl = req.originalUrl;
    req.flash("failure", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

// Middleware to pass redirect URL from session to locals and then delete from session
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};

// Check if the logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("failure", "Listing not found.");
    return res.redirect("/listings");
  }
  // Use req.user, NOT res.locals.curr.user
  if (!listing.owner.equals(req.user._id)) {
    req.flash("failure", "You need permission to edit this listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Check if the logged-in user is the author of the review
module.exports.isAuthor = async (req, res, next) => {
  const { reviewid } = req.params;
  const review = await Review.findById(reviewid);
  if (!review) {
    req.flash("failure", "Review not found.");
    return res.redirect("/listings");
  }
  // Use req.user here as well
  if (!review.author.equals(req.user._id)) {
    req.flash("failure", "You are not the author of this review.");
    return res.redirect(`/listings/${req.params.id}`);
  }
  next();
};
