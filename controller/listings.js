const Listing = require("../models/listing.js");
const axios = require("axios");

module.exports.index = async(req,res)=>{
    const allListen = await Listing.find({});
    res.render("listings/index.ejs",{allListen});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing = async(req,res,next)=>{
    // let {title, description, image, price, location, country} = req.body;
    // let listing = req.body.listing;
    const address = req.body.listing.location;
    const geoRes = await axios.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json`,
        { params: { key: process.env.MAP_TOKEN } }
    );
    let geometry = { type: "Point", coordinates: [0, 0] };
    if (geoRes.data.features.length > 0) {
        const [lng, lat] = geoRes.data.features[0].geometry.coordinates;
        geometry = { type: "Point", coordinates: [lng, lat] };
    }
    // let url =req.file.path;
    // let filename = req.file.filename;
    const  newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    // newListing.image= {url, filename};  
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    newListing.geometry = geometry;
    await newListing.save();
    // console.log(listing);
    req.flash("success","Successfully made a new listing");
    res.redirect("/listings"); 
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listen = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    })
     .populate("owner");
    if(!listen){
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listen});
};

module.exports.editForm = async(req,res,next)=>{
    
    let {id} = req.params;
    const listen = await Listing.findById(id);  
    if(!listen){
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }
    let originalImageUrl = listen.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_300,h_300,c_fill,g_auto/");
    req.flash("success","listing edit successfully");
    res.render("listings/edit.ejs",{listen, originalImageUrl});
      
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // ⭐ If user changed location → REGEOCODE
    if (req.body.listing.location) {
        const geo = await axios.get(
            `https://api.maptiler.com/geocoding/${encodeURIComponent(req.body.listing.location)}.json`,
             { params: { key: process.env.MAP_TOKEN } }
        );

        if (geo.data.features.length > 0) {
            const [lng, lat] = geo.data.features[0].geometry.coordinates;
            listing.geometry = { type: "Point", coordinates: [lng, lat] };
        }
    }
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await listing.save();
    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("error","Deleted Listing Successfully");
    res.redirect("/listings");
};


module.exports.filterListings = async (req, res) => {
    let category = req.params.keyword;

    let allListen = await Listing.find({ category });

    res.render("listings/index.ejs", { allListen });
};


module.exports.advancedSearch = async (req, res) => {
    const q = req.query.q;

    if (!q) {
        return res.redirect("/listings");
    }

    const regex = new RegExp(q, "i"); // case-insensitive search

    const allListen = await Listing.find({
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
            { country: { $regex: regex } },
            { location: { $regex: regex } },
            { category: { $regex: regex } }
        ]
    });

    if (allListen.length === 0) {
        req.flash("error", "No results found.");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListen });
};
