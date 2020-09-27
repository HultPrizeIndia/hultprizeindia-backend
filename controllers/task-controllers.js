const {validationResult} = require('express-validator');

// const mailer = require('nodemailer');

const RequestError = require('../models/request-error');
const CampusDirector = require('../models/campus-director');
const Task = require('../models/task');
const mongoose = require('mongoose');


const getAllTasks = async (req, res, next) => {
    let tasks;
    try {
        tasks = await Task.find({});
    } catch (err) {
        const error = new RequestError('Fetching tasks failed, please try again later.', 500, err);
        return next(error);
    }
    await res.json({"status": "success", tasks: tasks.map(task => task.toObject({getters: true}))});
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
    if(!task)
    {
        const error = new RequestError('Task not found', 404);
        return next(error);
    }
        await res.json({"status": "success", task: task});

};

const getTasksByAdminId = async (req, res, next) => {
    const adminId = req.params.adminId;
    let tasks;
    try {
        tasks = await Task.find({
            "_id": adminId
        });
    } catch (err) {
        const error = new RequestError('Fetching tasks failed, please try again later.', 500, err);
        return next(error);
    }
    await res.json({"status": "success", tasks: tasks.map(task => task.toObject({getters: true}))});
};

const createTaskForAll = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422, errors)
        );
    }
    const {name, description, priority, deadline} = req.body;

    const date = Date().toLocaleString();
    const adminId = req.userData.userId;

    const createdTask = new Task({
        name,
        description,
        priority,
        assignedBy: adminId,
        givenDate: date,
        deadline
    });
    // let taskId;
    try {
        await createdTask.save();
    } catch (err) {
        const error = new RequestError("Error creating task", 500, err);
        return next(error);
    }
    let campusDirectors;
    try {
        campusDirectors = await CampusDirector.find({});
    } catch (err) {
        const error = new RequestError('Fetching campus directors failed', 500, err);
        return next(error);
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        for (const campusDirector of campusDirectors) {
            campusDirector.notStartedTasks.push(createdTask._id);
            await campusDirector.save();
        }
        await sess.commitTransaction();
    } catch (err) {
        const error = new RequestError(
            "Error adding tasks of campus directors",
            500, err
        );
        return next(error);
    }
    await res
        .status(201)
        .json({"status": "success", task: createdTask});
};

const createTaskForOne = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422, errors)
        );
    }
    const campusDirectorId = req.params.campusDirectorId;
    const {name, description, priority, deadline} = req.body;
    const date = Date().toLocaleString();
    const adminId = req.userData.userId;

    const createdTask = new Task({
        name,
        description,
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

    let campusDirector;
    try {
        campusDirector = await CampusDirector.findById(campusDirectorId);
    } catch (err) {
        const error = new RequestError('Fetching campus director failed', 500, err);
        return next(error);
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        campusDirector.notStartedTasks.push(createdTask._id);
        await campusDirector.save();
        await sess.commitTransaction();

    } catch (err) {
        const error = new RequestError('Adding task to campus director failed!!', 500, err);
        return next(error);
    }

    await res
        .status(201)
        .json({"status": "success", task: createdTask});
};

const updateTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422)
        );
    }
    const taskId = req.params.taskId;

    // even if some fields are changed, front end shall pass full object
    const {name, description, priority, deadline} = req.body;

    const updatableFields = {
        name, description, priority, deadline
    };
    try {
        await Task.findByIdAndUpdate(taskId, updatableFields);
    } catch (err) {
        const error = new RequestError("Error fetching task", 500, err);
        return next(error);
    }
    await res
        .status(201)
        .json({"status": "success", updatedFields: updatableFields,});
};

const deleteTaskById = async (req, res, next) => {
    const taskId = req.params.taskId;
    let task;
    try {
        task = await Task.findById(taskId);
    } catch (err) {
        const error = new RequestError('Fetching task failed, please try again later.', 500, err);
        return next(error);
    }
    if(!task)
    {
        const error = new RequestError('Task not found', 404);
        return next(error);
    }
    try {
        await Task.deleteOne({_id:taskId});
    } catch (err) {
        const error = new RequestError('Deleting task failed, please try again later.', 500, err);
        return next(error);
    }
    let campusDirectors;
    try {
        campusDirectors = await CampusDirector.find({});
    } catch (err) {
        const error = new RequestError('Fetching campus directors failed', 500, err);
        return next(error);
    }
    try {
        console.log(taskId);
        const sess = await mongoose.startSession();
        sess.startTransaction();
        //TODO: ask for help
        for (const campusDirector of campusDirectors) {
            if (campusDirector.completedTasks.includes(taskId)) {
                console.log("In Comp");
                campusDirector.completedTasks = campusDirector.completedTasks.filter(item => item !== taskId);
                await campusDirector.save();
            } else if (campusDirector.onGoingTasks.includes(taskId)) {
                console.log("In on ");
                campusDirector.onGoingTask = campusDirector.onGoingTasks.filter(item => item !== taskId);
                await campusDirector.save();
            } else {
                console.log("In not");
                campusDirector.notStartedTasks = campusDirector.onGoingTasks.filter(item => item !== taskId);
                await campusDirector.save();
            }

        }
        await sess.commitTransaction();
    } catch (err) {
        const error = new RequestError(
            "Error deleting tasks of campus directors",
            500, err
        );
        return next(error);
    }

    res.json({"status": "Success", message: "Task deleted"});
};

const deleteTasks = async (req, res, next) => {
    try {
        await Task.deleteMany({});
    } catch (err) {
        const error = new RequestError('Deleting tasks failed, please try again later.', 500, err);
        return next(error);
    }
    try {
        await CampusDirector.updateMany({},
            {
                completedTasks: [], onGoingTasks: [], notStartedTasks: []
            }
        );
    } catch (err) {
        const error = new RequestError('Fetching campus directors failed, please try again later.', 500, err);
        return next(error);
    }
    res.json({"status": "Success", message: "All tasks deleted"});
};

exports.getAllTasks = getAllTasks;
exports.getTasksByAdminId = getTasksByAdminId;
exports.createTaskForAll = createTaskForAll;
exports.createTaskForOne = createTaskForOne;
exports.getTaskById = getTaskById;
exports.updateTask = updateTask;
exports.deleteTaskById = deleteTaskById;
exports.deleteTasks = deleteTasks;