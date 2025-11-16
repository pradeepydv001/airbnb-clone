if(process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}
console.log(process.env.secret);
const express = require("express");
const app =express();
const port = "5050"; 
let path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");   
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require("console");
const dbURL = process.env.ATLASDB_URL

//Middleware for validating listing data    
main().then(()=>{
    console.log("Mongoose connected")
}).catch((err)=>{
    console.log(err)
});
async function main(){
    await mongoose.connect(dbURL)
};

// Basic settings for app
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine(`ejs`,ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store =MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,  //For Lazy Update...
});
store.on("error",()=>{
    console.log("ERROR in MONGO",err);
})

const sessionOption ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    Cookie: {
        expire: Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge: 1000 * 60 * 60 * 24 *7,
        httpOnly:true  
    }
};
 
// Session and flash middleware
app.use(session(sessionOption));
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


// Flash middleware
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// app.get("/fakeUsers",async(req,res)=>{
//     const newUser = new user({
//         username:"kuldeep",
//         email:"Prade@123"
//     });
//     const registeredUser = await user.register(newUser,"chicken");
//     res.send(registeredUser);
// });
// Using listings routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
 
// Error
app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
// Error handling route
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})

// Listening to the server
app.listen(port,()=>{
    console.log(`Server is listning to url  ${port}`)
});