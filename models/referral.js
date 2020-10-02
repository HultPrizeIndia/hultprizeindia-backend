const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    name: {type: String, required: true},
    mobile:{type: String,required:true},
    email: {type: String, required: true,},
    description: {type: String, required: true},
    referredBy: {type: mongoose.Types.ObjectId, ref: 'CampusDirector'},
    referralDate: {type: Date, required: true}
});

module.exports = mongoose.model('Referral', referralSchema);