// Query here is basically like a doubt, which is raised by the CampusDirector to the Admins.

const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    comment: {type: String},
    raisedBy: {type: mongoose.Types.ObjectId, ref: 'CampusDirector'},
    raisedFor: {type: mongoose.Types.ObjectId, ref: 'Admin'},
    raiseDate: {type: Date, required: true}
});

module.exports = mongoose.model('Query', querySchema);