const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../util/wrapasync.js");
const passport = require("passport");
const { route } = require("./listings.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");
const user = require("../models/user.js");

router.route("/signup")
.get(userController.renderSignup)
.post(asyncWrap(userController.signupForm));


router.route("/login")
.get(userController.renderLogin)
.post(
   saveRedirectUrl,
   passport.authenticate("local",{
   failureRedirect: '/login',
   failureFlash: true
}),
   asyncWrap(userController.loginForm)
); 

// Logout logic
router.get("/logout",userController.logoutUser);
module.exports = router;
