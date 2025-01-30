const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: '../.env' });


console.log("Listing model import successfully");

const dbURL = process.env.ATLASDB_URL;

if (!dbURL) {
    console.error("Error: ATLASDB_URL is undefined. Please check your .env file.");
    process.exit(1); // Exit if MongoDB URL is not found
}

async function main() {
    await mongoose.connect(dbURL);

}


main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});


const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "6791bbe2abc7237482e39b70" }))
    await Listing.insertMany(initData.data);
    console.log("Database initialized")
}

main().then(initDB);