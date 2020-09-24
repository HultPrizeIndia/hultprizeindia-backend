const mongoose = require('mongoose');


//TODO: Add expiry field.
const blacklistSchema = new mongoose.Schema({
    tokens: {type:String,required:true},
    listedOn: {type:Date,required:true}
});

module.exports = mongoose.model('Blacklist', blacklistSchema);