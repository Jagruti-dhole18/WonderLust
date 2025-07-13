const User=require("../models/user");

//signUp form
module.exports.signUp=(req, res) => {
  res.render("users/signup.ejs");
}

//signup user
module.exports.signUpUser=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      // console.log(registerUser);
      req.login(registerUser,(err)=>{
        if(err){
          next(err);
        }
        req.flash("success", "Welcome to WonderLust!");
      res.redirect("/listings");
      });
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }

  //login
  module.exports.loginUser= async (req, res) => {
    req.flash("success", "Welcome back to WonderLust-You're now Logged In!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }

  //logout
  module.exports.logoutUser=(req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You're Logout successfully");
    res.redirect("/listings");
  });
}