const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const adminSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    image: {type: String},
    password: {type: String, required: true, minlength: 6},
    mobile: {type: String, required: true},
    campusDirectors: [{type: mongoose.Types.ObjectId, ref: 'CampusDirector'}]
});

adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Admin', adminSchema);