const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    name: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true}
    // cdCount: {type: Number, required: true}
});


module.exports = mongoose.model('University', universitySchema);