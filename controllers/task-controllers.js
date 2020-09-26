const {validationResult} = require('express-validator');

// const mailer = require('nodemailer');

const RequestError = require('../models/request-error');
const CampusDirector = require('../models/campus-director');
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

const getTaskByAdminId = async (req,res,next) => {

};

const getTaskCountStatus = async (req, res, next) => {
    const taskId = req.params.taskId;
    let campusDirectors;
    try {
        campusDirectors = await CampusDirector.find({}).populate('tasks');
    } catch (err) {
        const error = new RequestError('Fetching campus directors failed, please try again later.', 500, err);
        return next(error);
    }

    // for (const campusDirector of campusDirectors) {
    //     await campusDirector.populate('tasks');
    // }
    console.log(campusDirectors[0].tasks);
    res.json({"status": "success"});
};

const createTaskForAll = async (req, res, next) => {};

const createTaskForOne = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422, errors)
        );
    }

    const {name, description, priority, deadline} = req.body;

    const adminId = req.userData.userId;
    const date = Date().toLocaleString();

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
    const {name, description,  priority, deadline} = req.body;

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
    try {
        await Task.findByIdAndRemove(taskId);
    } catch (err) {
        const error = new RequestError('Deleting task failed, please try again later.', 500, err);
        return next(error);
    }
    let campusDirectorsWithTask;
    try {
        campusDirectorsWithTask = await CampusDirector.find({},
            {
                _id: 0, name: 1, students: {
                    $elemMatch: {$eq: taskId}
                }
            }
        );
    } catch (err) {
        const error = new RequestError('Fetching campus directors failed', 500, err);
        return next(error);
    }
    for (const campusDirector of campusDirectorsWithTask) {
        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            // campusDirector.tasks.;
            await campusDirector.save();
            await sess.commitTransaction();
        } catch (err) {
            const error = new RequestError(
                "Error deleting tasks of campus directors",
                500, err
            );
            return next(error);
        }
    }
    res.json({"status": "Success", message: "Task deleted"});
};

const deleteTasks = async (req, res, next) => {
    try {
        await Task.remove({});
    } catch (err) {
        const error = new RequestError('Deleting tasks failed, please try again later.', 500, err);
        return next(error);
    }
    try {
        await CampusDirector.updateMany({}, {tasks: []});
    } catch (err) {
        const error = new RequestError('Fetching campus directors failed, please try again later.', 500, err);
        return next(error);
    }
    res.json({"status": "Success", message: "All tasks deleted"});
};

exports.getAllTasks = getAllTasks;
exports.getTaskByAdminId = getTaskByAdminId;
exports.getTaskCountStatus = getTaskCountStatus;
exports.createTask = createTaskForOne;
exports.getTaskById = getTaskById;
exports.updateTask = updateTask;
exports.deleteTaskById = deleteTaskById;
exports.deleteTasks = deleteTasks;