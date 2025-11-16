const express = require("express");
const router = express.Router({mergeParams: true});
const asyncWrap = require("../util/wrapasync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const  {validateReview,isLoggedIn, isReviewAuther} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");
// Post Reviews
router.post("/",isLoggedIn,validateReview,asyncWrap(reviewController.createPost));

// Delete Route for reviews can be added here
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuther, 
    asyncWrap(reviewController.deleteReview));

module.exports = router;