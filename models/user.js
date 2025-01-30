const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passpostLocalMongoose = require('passport-local-mongoose');

const userSchma = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchma.plugin(passpostLocalMongoose);
module.exports = mongoose.model("User", userSchma);