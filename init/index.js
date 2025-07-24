const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js");
const User = require("../models/user");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(() => {
    console.log("connected")
})
    .catch((err) => {
        console.log(err);
    })

const initDB = async()=> {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj,owner:"6872706980511c9b5aa70965"}))
  await Listing.insertMany(initData.data);
  console.log("Data init done");
}
initDB();