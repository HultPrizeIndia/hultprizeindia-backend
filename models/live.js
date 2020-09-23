const mongoose = require('mongoose');

const liveSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    link: {type: String, required: true},
    eventDateTime: {type: Date, required: true}
});

module.exports = mongoose.model('Live', liveSchema);