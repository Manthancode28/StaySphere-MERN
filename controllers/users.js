const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (error) => {
            if (error) {
                return next(error);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup")
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res, next) => {
    if (req.user) {
        req.flash("success", "Welcome back to wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);

    } else {
        req.flash("Somthing went worng 😐");
        next(new Error("Login failed"));
        res.redirect("/login");
    }
};

module.exports.logout = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        req.flash("success", "You are log out now");
        res.redirect("/listings");
    })
};