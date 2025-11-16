const ExpressError = require("./util/expressError.js");
const { listingSchema, reviewSchema} = require("./schema.js");
const Listing = require("./models/listing");
const Review = require("./models/reviews");

// isLoggedIn middleware
module.exports.isLoggedIn = (req,res,next)=>{  
    if(!req.isAuthenticated()){
        //redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next(); 
};
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner =async (req,res,next)=>{
    let {id} = req.params;
    let listing=await Listing.findById(id);
    //  FIX 1: listing exists?
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    //  FIX 2: req.user exists?
    if (!req.user) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    //  FIX 3: Correct owner?
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    // validation Listing middleware 
        let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map(el=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
        next();
    
};

module.exports.validateReview = (req,res,next)=>{   
    // validation Reviews middleware
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};
module.exports.isReviewAuther =async (req,res,next)=>{
    let {id, reviewId} = req.params;
    let review=await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(req.user._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};