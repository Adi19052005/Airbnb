const express = require("express");
const User = require("../models/user")
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { userSchema } = require("../schema.js");
const passport = require("passport");
const userController = require("../controllers/user.js")
const { saveRedirectUrl } = require("../middleware.js");

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false }); // collect all errors
  if (error) {
    const messages = error.details.map((el) => el.message);
    req.flash("failure", messages); // Store array of messages
    return res.redirect("/signup"); // adjust this route if needed
  } else {
    next();
  }
};

router.get("/signup", userController.renderSignup)

router.post("/signup", validateUser,userController.signup );

router.get("/login", userController.renderLogin);

router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Wrong credentials"
  }),
  userController.login
);
router.get("/logout", userController.logout)
module.exports = router;



