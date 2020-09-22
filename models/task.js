const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const tasksSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: Number},
    priority: {type: Number, required: true},
    assignedBy: {type: mongoose.Types.ObjectId, ref: 'Admins'},
    givenDate:  {type: Date, required: true},
    deadline:  {type: Date, required: true}
});

tasksSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Task', tasksSchema);