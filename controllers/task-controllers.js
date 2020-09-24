const {validationResult} = require('express-validator');

// const mailer = require('nodemailer');

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
    await res.json({tasks: tasks.map(task => task.toObject({getters: true}))});
};

const getTaskById = async (req, res, next) => {
    const taskId = req.params.taskId;
    let task;
    try {
        task = await Task.findById(taskId);
    } catch (err) {
        const error = new RequestError('Fetching task failed, please try again later.', 500, err);
        return next(error);
    }
    await res.json({task: task});
};

const getTaskCountStatus = async (req, res, next) => {
    const taskId = req.params.taskId;

};

const createTask = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422,errors)
        );
    }
    const adminId = req.userData.userId;

    // assignedBy will come from jwt payload
    // givenDate is server generated

    const {name, description, status, priority, deadline} = req.body;
    let existingAdmin;
    try {
        existingAdmin = await Admin.findById(adminId);
    } catch (err) {
        const error = new RequestError("Error querying database", 500, err);

        return next(error);
    }

    if (!existingAdmin) {
        const error = new RequestError('Only admin can create tasks.', 422);
        return next(error);
    }

    const date = Date().toLocaleString();

    const createdTask = new Task({
        name,
        description,
        status,
        priority,
        assignedBy: adminId,
        givenDate: date,
        deadline
    });

    try {
        await createdTask.save();
    } catch (err) {
        const error = new RequestError("Error creating task", 500, err);
        return next(error);
    }
    await res
        .status(201)
        .json({task: createdTask,});
};
const updateTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422)
        );
    }
    const taskId = req.params.taskId;
    const adminId = req.userData.userId;


    // even if some fields are changed, front end shall pass full object
    const {name, description, status, priority, deadline} = req.body;

    let existingAdmin;
    try {
        existingAdmin = await Admin.findById(adminId);
    } catch (err) {
        const error = new RequestError("Error querying database", 500, err);

        return next(error);
    }

    if (!existingAdmin) {
        const error = new RequestError('Only admin can create tasks.', 422);
        return next(error);
    }
    let existingTask;
    //Todo: check update
    try {
        existingTask = await Task.findByIdAndUpdate(taskId,{
            name, description, status, priority, deadline,
        });
    } catch (err) {
        const error = new RequestError("Error fetching task", 500, err);
        return next(error);
    }
    await res
        .status(201)
        .json({task: existingTask,});
};

const deleteTaskById = async (req, res, next) => {
    const userId = req.userData.userId;
    const taskId = req.params.taskId;
    let existingAdmin;
    try {
        existingAdmin = await Admin.findById(userId);
    } catch (err) {
        const error = new RequestError("Finding admin failed", 500, err);
        return next(error);
    }
    if (existingAdmin) {
        try {
            await Task.findByIdAndRemove(taskId);
        } catch (err) {
            const error = new RequestError('Deleting task failed, please try again later.', 500, err);
            return next(error);
        }
    } else {
        const error = new RequestError("Not Authorized to delete task", 500);
        return next(error);
    }
    res.json({status:"Success",message:"Task deleted"});
};

const deleteTasks = async (req, res, next) => {
    try {
        await Task.remove({});
    } catch (err) {
        const error = new RequestError('Deleting tasks failed, please try again later.', 500, err);
        return next(error);
    }
    res.json({status:"Success",message:"All tasks deleted"});
};

exports.getAllTasks = getAllTasks;
exports.getTaskCountStatus = getTaskCountStatus;
exports.createTask = createTask;
exports.getTaskById = getTaskById;
exports.updateTask = updateTask;
exports.deleteTaskById = deleteTaskById;
exports.deleteTasks = deleteTasks;