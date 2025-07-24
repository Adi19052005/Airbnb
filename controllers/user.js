const passport = require("passport");
const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body.user;
    const newUser = new User({ email, username });
    const registered = await User.register(newUser, password);
    console.log(registered);
    req.login(registered, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User was registered successfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("failure", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome to Wanderlust");
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};
