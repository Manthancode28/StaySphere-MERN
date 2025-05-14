const Listing = require("../models/listing");
const geocoder = require('node-geocoder')({
    provider: 'openstreetmap', // You can use OpenStreetMap as the provider
    httpAdapter: 'https',
    apiKey: null, // No API key needed for OpenStreetMap
    formatter: null
});



module.exports.index = async(req, res) => {
    // const allListings = await Listing.find({});
    // res.render("listings/index", { allListings });

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
        const trimmedId = id.trim(); // Remove leading/trailing spaces
        const listing = await Listing.findById(trimmedId).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
        if (!listing) {
            req.flash("error", "Listing not found");
            res.redirect("/listings");
        }
        res.render("listings/show", { listing });
    } catch (error) {
        // console.error("Error fetching listing:", error);
        res.status(400).send("Invalid ID format");

    }
};

module.exports.createListing = async(req, res, next) => {

    // Geocode the location (city)
    const { location } = req.body.listing; // City name entered by the user
    const geocodeResult = await geocoder.geocode(location);

    // If geocodeResult is empty, location is invalid
    if (!geocodeResult.length) {
        req.flash('error', 'Invalid city name');
        return res.redirect('/listings/new');
    }

    // Extract latitude and longitude from the geocode result
    const { latitude, longitude } = geocodeResult[0];

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.amenities = req.body.listing.amenities || [];
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.latitude = latitude; // Save latitude
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

    // If location is being updated, geocode the new location
    if (listingData.location) {
        const geocodeResult = await geocoder.geocode(listingData.location);

        // If geocodeResult is empty, location is invalid
        if (!geocodeResult.length) {
            req.flash('error', 'Invalid city name');
            return res.redirect(`/listings/${id}/edit`);
        }

        // Extract latitude and longitude from the geocode result
        const { latitude, longitude } = geocodeResult[0];
        listingData.latitude = latitude;
        listingData.longitude = longitude;
    }

    // Update the listing with all data including potential new coordinates
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