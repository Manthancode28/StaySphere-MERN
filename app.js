// if (process.env.NODE_ENV != 'production') {
//     require('dotenv').config()
//     console.log(process.env.SCRETE)
// }

require('dotenv').config();


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Review = require("./models/review.js");
const Joi = require('joi');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
const passportLocalMongoose = require('passport-local-mongoose');
const bookingRoutes = require("./routes/bookings");

// const { listingSchema, reviewSchema } = require('./utils/validateListing'); // Import Joi validation schema
// const wrapAsync = require('./utils/wrapAsync.js');
// const Listing = require("./models/listing.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
// const { error } = require('console');
const userRouter = require("./routes/user.js");



const dbURL = process.env.ATLASDB_URL;


async function main() {
    await mongoose.connect(dbURL);

}

main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SCRETE,
    },
    touchAfter: 24 * 3600,
})


store.on("error", () => {
    console.log("Error in session store", error);
})
const sessionOptions = {
    store,
    secret: process.env.SCRETE,
    resave: false,
    saveUninitialized: true, // Fixed typo here
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.use(session(sessionOptions));
app.use(flash());
// Use flash before routes 

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     const registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/bookings", bookingRoutes);

//Handeling error using wrapAsync function
// app.use((err, req, res, next) =>{
// res.send("Something went wrong");
// })


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found😕"));
});

// app.use((err, req, res, next) => {
//     const { statusCode = 500, message = "Something went wrong" } = err;
//     res.render("error", { message });
// });

app.use((error, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = error;
    res.render("error.ejs", { error });
});


// In your server-side code (app.js or a helpers file)
function getAmenityIcon(amenity) {
    const iconMap = {
        'Wi-Fi': 'fa-wifi',
        'Pool': 'fa-water',
        'Kitchen': 'fa-utensils',
        'Parking': 'fa-car',
        'Air Conditioning': 'fa-snowflake',
        'Heating': 'fa-temperature-high',
        'TV': 'fa-tv',
        'Washer': 'fa-soap',
        'Dryer': 'fa-wind',
        'Gym': 'fa-dumbbell',
        'Elevator': 'fa-elevator',
        'Hot Water': 'fa-hot-tub',
        'Fireplace': 'fa-fire',
        'Pet Friendly': 'fa-paw',
        'Smoking Allowed': 'fa-smoking',
        'Dedicated Workspace': 'fa-laptop',
        'Breakfast': 'fa-mug-hot',
        'Lake view': 'fa-water',
        'Mountain view': 'fa-mountain-sun',
        'Board Games': 'fa-chess-board'
            // Add more mappings as needed
    };

    // Return the matching icon or a default one
    return `fa-solid ${iconMap[amenity] || 'fa-check'}`;
}

// Make it available to your templates
app.locals.getAmenityIcon = getAmenityIcon;



app.listen(8080, () => {
    console.log('Server is running on port 8080');
});