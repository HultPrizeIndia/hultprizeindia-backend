const {validationResult} = require('express-validator');

const mailer = require('nodemailer');

const RequestError = require('../models/request-error');
const Admin = require('../models/admin');
const Task = require('../models/task');

const getAllTasks = async (req, res, next) => {
    let tasks;
    try {
        tasks = await Task.find({});
    } catch (err) {
        const error = new RequestError('Fetching tasks failed, please try again later.', 500, err);
        return next(error);
    }
    await res.json({"status":"success",tasks: tasks.map(task => task.toObject({getters: true}))});
};

const getTaskById = async (req,res,next) => {
    let task;
    try{}catch(err){

    }
};
const getTaskCountStatus = async(req,res,next) => {};

const createTask = async(req, res,next) => {};
const updateTask = async(req,res,next) => {};

const deleteTaskById = async(req,res,next) => {
    const userId = req.userData.userId;
    const taskId = req.body.taskId;
    let existingAdmin;
    try {
        existingAdmin = await Admin.findById(userId);
    } catch (err){
        const error = new RequestError("Finding admin failed", 500, err);
        return next(error);
    }
    if (existingAdmin){
        try {
            await  Task.findByIdAndRemove(taskId);
        } catch (err) {
            const error = new RequestError('Deleting task failed, please try again later.', 500, err);
            return next(error);
        }
    } else {
        const error = new RequestError("Not Authorized to delete task", 500);
        return next(error);
    }
};
const deleteTasks = async(req,res, next) => {
    try {
        await  Task.remove({});
    } catch (err) {
        const error = new RequestError('Deleting tasks failed, please try again later.', 500, err);
        return next(error);
    }
};

exports.getAllTasks = getAllTasks;
exports.getTaskCountStatus = getTaskCountStatus;
exports.createTask = createTask;
exports.getTaskById = getTaskById;
exports.updateTask = updateTask;
exports.deleteTaskById = deleteTaskById;
exports.deleteTasks = deleteTasks;