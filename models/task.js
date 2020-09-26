const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//      Task Number Meaning
// 0  :-  NotStarted
// 1  :-  Started
// 2  :-  completed

//      Priority Number Meaning
// 0  :-  Low
// 1  :-  Medium
// 2  :-  High

const taskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    priority: {type: Number, required: true},
    assignedBy: {type: mongoose.Types.ObjectId, ref: 'Admin'},
    givenDate:  {type: Date, required: true},
    deadline:  {type: Date, required: true}
});

taskSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Task', taskSchema);