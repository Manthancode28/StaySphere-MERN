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
        // filename: {
        //     type: String,
        // },
        // url: {
        //     type: String,
        // },
        url: String,
        filename: String,
        // default: "https://images.squarespace-cdn.com/content/v1/5e72c8bfe21ad940ba788673/1626985470666-LVUUK5JZ5LE0O893756Z/what-is-airbnb-thumbnail.jpg",
    },
    latitude: Number, // Latitude of the location
    longitude: Number, // Longitude of the location
    // image: {
    //     type: Map,
    //     of: String, // This will allow you to store an object with properties like filename and url
    //     default: {
    //         filename: 'defaultImage',
    //         url: 'https://images.squarespace-cdn.com/content/v1/5e72c8bfe21ad940ba788673/1626985470666-LVUUK5JZ5LE0O893756Z/what-is-airbnb-thumbnail.jpg',
    //     },
    // },
    // image: {
    //     type: {
    //         filename: String,
    //         url: String,
    //     },
    //     default: {
    //         filename: 'defaultImage',
    //         url: 'https://images.squarespace-cdn.com/content/v1/5e72c8bfe21ad940ba788673/1626985470666-LVUUK5JZ5LE0O893756Z/what-is-airbnb-thumbnail.jpg',
    //     },
    // },
    // image: {
    //     type: String,
    //     default: 'https://images.squarespace-cdn.com/content/v1/5e72c8bfe21ad940ba788673/1626985470666-LVUUK5JZ5LE0O893756Z/what-is-airbnb-thumbnail.jpg',
    // },


    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });

    }
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;