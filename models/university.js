const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const universitySchema = new mongoose.Schema({
    name: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true}
    // cdCount: {type: Number, required: true}
});

universitySchema.plugin(uniqueValidator);

module.exports = mongoose.model('University', universitySchema);