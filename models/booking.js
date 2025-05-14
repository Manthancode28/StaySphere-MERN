const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    checkIn: Date,
    checkOut: Date,
    guests: Number,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'declined'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);