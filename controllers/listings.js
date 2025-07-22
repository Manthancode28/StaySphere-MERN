const Listing = require("../models/listing");
const geocoder = require('node-geocoder')({
    provider: 'openstreetmap', 
    httpAdapter: 'https',
    apiKey: null, 
    formatter: null
});



module.exports.index = async(req, res) => {

    const { category } = req.query;
    let allListings;

    if (category) {
        allListings = await Listing.find({ category });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index", { allListings, selectedCategory: category });
};


module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    try {
        const { id } = req.params;
        const trimmedId = id.trim(); 
        const listing = await Listing.findById(trimmedId).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
        if (!listing) {
            req.flash("error", "Listing not found");
            res.redirect("/listings");
        }
        res.render("listings/show", { listing });
    } catch (error) {
        res.status(400).send("Invalid ID format");

    }
};

module.exports.createListing = async(req, res, next) => {

    const { location } = req.body.listing; 
    const geocodeResult = await geocoder.geocode(location);

    if (!geocodeResult.length) {
        req.flash('error', 'Invalid city name');
        return res.redirect('/listings/new');
    }

    const { latitude, longitude } = geocodeResult[0];

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.amenities = req.body.listing.amenities || [];
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.latitude = latitude; 
    newListing.longitude = longitude;


    await newListing.save();
    req.flash("success", "Listing created successfully");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const trimmedId = id.trim();
    const listing = await Listing.findById(trimmedId);
    if (!listing) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });

};

module.exports.updateListing = async(req, res) => {
    let { id } = req.params;


    let listingData = {...req.body.listing };

 
    if (listingData.location) {
        const geocodeResult = await geocoder.geocode(listingData.location);


        if (!geocodeResult.length) {
            req.flash('error', 'Invalid city name');
            return res.redirect(`/listings/${id}/edit`);
        }

        const { latitude, longitude } = geocodeResult[0];
        listingData.latitude = latitude;
        listingData.longitude = longitude;
    }

    let listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });

    listing.amenities = req.body.listing.amenities || [];
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated successfully");
    res.redirect("/listings");

};

module.exports.deleteListing = async(req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted successfully");
    res.redirect("/listings");
};