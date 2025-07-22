const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Listing = require('../models/listing');
const { isLoggedIn } = require('../middleware');

// Submit a booking request
router.post('/listings/:id/book', isLoggedIn, async(req, res) => {
    const listing = await Listing.findById(req.params.id);
    const { checkIn, checkOut, guests } = req.body;

    const booking = new Booking({
        listing: listing._id,
        guest: req.user._id,
        checkIn,
        checkOut,
        guests
    });

    await booking.save();
    req.flash("success", "Booking request sent!");
    res.redirect(`/listings/${listing._id}`);
});

// Host's booking requests view
router.get('/host', isLoggedIn, async(req, res) => {
    const listings = await Listing.find({ owner: req.user._id });
    const allBookings = await Booking.find({})
        .populate('listing')
        .populate('guest');

    const myBookings = allBookings.filter(b => b.listing.owner.equals(req.user._id));
    res.render('bookings/host', { bookings: myBookings, listings });
});

// Update booking status (accept/decline)
router.post('/:id/status', isLoggedIn, async(req, res) => {
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking.listing.owner.equals(req.user._id)) {
        req.flash('error', 'Unauthorized');
        return res.redirect('/bookings/host');
    }

    booking.status = req.body.status;
    await booking.save();
    res.redirect('/bookings/host');
});

// Guest's bookings
router.get('/my', isLoggedIn, async(req, res) => {
    const bookings = await Booking.find({ guest: req.user._id }).populate('listing');
    res.render('bookings/my', { bookings });
});



module.exports = router;