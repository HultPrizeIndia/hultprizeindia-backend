const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const campusDirectorSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    image: {type: String},
    password: {type: String, required: true, minlength: 6},
    mobile: {type: String, required: true},
    tasks: [{type: String, required: false}]
});

campusDirectorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('CampusDirector', campusDirectorSchema);