const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createPost = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("Review Added Successfully");
    req.flash("success","Review added successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("error","Review deleted successfully");
    res.redirect(`/listings/${id}`);
}