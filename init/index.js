const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");



main().then(()=>{
    console.log("Database is connect");
}).catch((err)=>{
    console.log("err");
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
}; 
const initDb =async()=>{
    await Listing.deleteMany({});
    const seedData = initdata.data.map((obj)=>({
        ...obj,
        owner: new mongoose.Types.ObjectId("690fd4ac440d0437cf5f0ccc"),
    }));
    await Listing.insertMany(seedData);
    console.log("data was install");
}
initDb();