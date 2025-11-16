const mongoose = require("mongoose");
const { ref } = require("joi");
const Review = require("./reviews.js");
const listningSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],   // [lng, lat]
            default: [0,0]   // ✔ DEFAULT VALUE (Safe)
        }
    },
    category: {
    type: String,
    required: true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],    
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
});
listningSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
}
})
const Listing = mongoose.model("Listing",listningSchema);
module.exports=Listing;