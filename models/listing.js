const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        
        url: String,
        filename: String,
    },
    latitude: Number,
    longitude: Number, // Longitude of the location
   
    price: Number,
    location: String,
    country: String,
    amenities: [String],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: [
            "Trending", "Room", "Iconic City", "Mountains", "Castles",
            "Amazing Pool", "Farms", "Arctic", "Camping", "Sea", "Homes"
        ]
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });

    }
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;