const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const{isOwner}=require("../middleware.js")
const{isLoggedIn}=require("../middleware.js")
const listingController= require("../controllers/listings.js")
const multer = require("multer")
const {storage}=require("../cloudConfig.js")
const upload = multer ({storage})

const validatelisting = (req, res, next) => {
    const { error } = listingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map(el => el.message);
        req.flash("failure", messages);
        return res.redirect("back"); // or a specific route like `/listings/new`
    } else {
        next();
    }
};

// Route to display all listings
router.get("/listings", wrapAsync(listingController.index));

// Route to display form for new listing
router.get("/listings/new",isLoggedIn,listingController.rendernewform);

// Route to create new listing
router.post("/listings",isLoggedIn, validatelisting,upload.single('image'), wrapAsync(listingController.createnew));

// Route to display details of a specific listing
router.get("/listings/:id", wrapAsync(listingController.show));

// Route to display edit form for a specific listing
router.get("/listings/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editform));

// Route to update a specific listing
router.put("/listings/:id",upload.single('image'), validatelisting,isLoggedIn,isOwner, wrapAsync(listingController.update));

// Route to delete a specific listing
router.delete("/listings/:id",isLoggedIn,isOwner, wrapAsync(listingController.delete));

module.exports = router;
