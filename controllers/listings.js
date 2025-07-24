const { response } = require("express");
const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken:mapToken})

//index
    module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}

module.exports.rendernewform = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createnew = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  newListing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };

  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};


module.exports.show =(async (req, res, next) => {
    const { id } = req.params;
   const listing = await Listing.findById(id)
    .populate({
    path: "reviews",
    populate: {
      path: "author",
      model: "user" // Explicitly specify the model
    }
  })
  .populate("owner");

    if (!listing) {
        req.flash("failure", "Listing doesn't exist");
        return res.redirect("/listings"); 
    }
console.log(listing)
    res.render("listings/show", { listing});
})

module.exports.editform =(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        return next(new ExpressError("Listing Not Found", 404));
    }
     let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing,originalImageUrl });
})

module.exports.update = async (req, res) => {
    const { id } = req.params;

    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data");
    }

    // Geocode the updated location
    const geoResponse = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    // Update listing with new data
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    // Update geometry
    listing.geometry = geoResponse.body.features[0].geometry;

    // Update image if new file uploaded
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await listing.save();

    req.flash("success", "Listing edited");
    res.redirect(`/listings`);
};


module.exports.delete =(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("failure"," Listing Deleted")
    res.redirect("/listings");
})