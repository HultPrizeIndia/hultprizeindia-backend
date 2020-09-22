const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const adminSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    // image: {type: String},
    password: {type: String, required: true, minlength: 6},
    mobile: {type: String, required: true},
    joinDate:{type: Date, required: true}
    // campusDirectors: [{type: mongoose.Types.ObjectId, ref: 'CampusDirector'}]
});

adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Admin', adminSchema);