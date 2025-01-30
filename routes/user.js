const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require("../controllers/users");


//SignUp Route :  Render to signup form 
router.get("/signup", userController.renderSignupForm);


//SignUp Route : Get data from sign up from and register user
router.post("/signup", wrapAsync(userController.signUp));


//Login Route :  Render to login form
router.get("/login", userController.renderLoginForm);


//Login Route : Get data from form and Authenticate User
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true
    }),
    userController.login
);

//Logout Route
router.get("/logout", userController.logout);

module.exports = router;