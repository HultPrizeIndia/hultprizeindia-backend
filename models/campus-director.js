const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const campusDirectorSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    // image: {type: String},
    password: {type: String, required: true, minlength: 6},
    university: {type: mongoose.Types.ObjectId, ref: 'University'},
    mobile: {type: String, required: true},
    joinDate: {type: Date, required: true},
    tasks: [{type: mongoose.Types.ObjectId, ref: 'Task'}]
});

campusDirectorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('CampusDirector', campusDirectorSchema);