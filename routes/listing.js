const express = require('express');
const router = express.Router();
// const { listingSchema, reviewSchema } = require('../utils/validateListing'); // Import Joi validation schema
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createListing));


//  /New Route (GET Req)
router.get("/new", isLoggedIn, listingController.renderNewForm);


// Search Route
router.get("/search", async(req, res) => {
    try {
        const { location } = req.query; // Extract location from the query string
        const allListings = await Listing.find({
            location: { $regex: location, $options: "i" } // Case-insensitive partial match
        });

        // Render the EJS template with filtered results
        res.render("listings", { allListings }); // Pass the results to the 'listings.ejs' view
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching listings.");
    }
});

router.route("/:id")
    .get(listingController.showListing)
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



//Index Route
// router.get("/", wrapAsync(listingController.index));



//show routes 
// router.get("/:id", listingController.showListing);



//create listing
// router.post("/", isLoggedIn, wrapAsync(listingController.createListing));



// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

//Update Route
// router.put("/:id", isLoggedIn, isOwner, wrapAsync(listingController.updateListing))


//Delete Route 
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;