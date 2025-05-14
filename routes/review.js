const express = require('express');
const router = express.Router({ mergeParams: true });
const { listingSchema, reviewSchema } = require('../utils/validateListing'); // Import Joi validation schema
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require("../controllers/reviews.js");

//Validate Review
function validateReview(req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errorMessages = error.details.map(err => err.message);
        throw new ExpressError(400, errorMessages);
        //   return res.status(400).render("error", { error: { statusCode: 400, message: errorMessages.join(', ') } });
    }
    next();
}


//Reviews
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

//Review Delete Route 

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;