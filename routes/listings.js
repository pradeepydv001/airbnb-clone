const express = require("express");
const router = express.Router();
const asyncWrap = require("../util/wrapasync.js");
const Listing = require("../models/listing.js"); 
const  {isLoggedIn, isOwner, validateListing} = require("../middleware.js");  
const listingController = require("../controller/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage:storage});


router.route("/")
.get(asyncWrap(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,asyncWrap(listingController.createListing));

// Search route Always first me likhte hn
router.get("/search", asyncWrap(listingController.advancedSearch));

// new route 
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(asyncWrap(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,asyncWrap(listingController.updateListing))
.delete(isLoggedIn,isOwner,asyncWrap(listingController.deleteListing));
//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.editForm));

// fillter route
router.get("/filter/:keyword", asyncWrap(listingController.filterListings));




module.exports = router; 