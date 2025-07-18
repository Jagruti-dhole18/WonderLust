const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");

//signup
router.route("/signup")
.get(userController.signUp)
.post(
  wrapAsync(userController.signUpUser)
);

router.route("/login")
.get((req, res) => {
  res.render("users/login.ejs");
})
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
 userController.loginUser
);


router.get("/logout",userController.logoutUser)
module.exports = router;
