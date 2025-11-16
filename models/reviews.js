const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema({
    Comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

});
module.exports = mongoose.model("Review",ReviewSchema); 