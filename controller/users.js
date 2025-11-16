const User =  require("../models/user.js");

module.exports.signupForm = async(req,res)=>{
   try{
      let {username,email,password} = req.body;
      const newUser = new User({username,email});
      const registeredUser = await User.register(newUser,password);
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
         if(err){
            return next(err);
         }  
         req.flash("success","Welcome to Listing App");
         res.redirect("/listings");
      });
   } catch(e){ 
       req.flash("error",e.message);
       res.redirect("/signup");
   }
};

module.exports.renderSignup = (req,res)=>{
   res.render("users/signup.ejs");
};

module.exports.renderLogin = (req,res)=>{
   res.render("users/login.ejs");
};


module.exports.loginForm = async(req,res)=>{
   req.flash("succes","Logged In Successfully");
   req.flash("success","Welcome Back!");
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
}
module.exports.logoutUser = (req,res)=>{
   req.logout((err)=>{
      if(err){
         return next(err);
       }
      req.flash("error","Logged out");
      res.redirect("/listings");
   });
};
