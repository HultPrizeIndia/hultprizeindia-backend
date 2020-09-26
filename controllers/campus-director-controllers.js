// const {validationResult} = require('express-validator');
// const bcrypt = require('bcryptjs');
// const mailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport');
// const jwt = require('jsonwebtoken');

const RequestError = require('../models/request-error');
const CampusDirector = require('../models/campus-director');
const authController = require('./authentication-controller');
const mongoose = require('mongoose');



const getCampusDirectors = async (req, res, next) => {
    let campusDirectors;
    try {
        campusDirectors = await CampusDirector.find({}, '-password');
    } catch (err) {
        const error = new RequestError('Fetching campus directors failed, please try again later.', 500, err);
        return next(error);
    }
    await res.json({"status":"success",campusDirectors: campusDirectors.map(campusDirector => campusDirector.toObject({getters: true}))});
};

const getCampusDirectorsByStatus = async (req,res,next) => {
    const {taskId, status} = req.body;
    // const id = mongoose.Types.ObjectId(taskId);
    let campusDirectors = [];
    let temp;
    try {
        if (status.toLowerCase() == "completed") {

            temp = await CampusDirector.find({}, '-password');
            for(i=0;i<temp.length;i++) {
                if (temp[i]["completedTasks"].includes(taskId)) {
                    campusDirectors.push(temp[i]);
                }
            }
            // campusDirectors = await CampusDirector.find({"completedTasks": { $elemMatch: { $eq: id }}}); //Maybe a bug, but this doesnt work (It does in Atlas though)
            // campusDirectors = await CampusDirector.$where(function () {
            //     this.completedTasks.includes(taskId);
            // });
            // campusDirectors = await CampusDirector.find({"completedTasks" : {"$in" : [taskId]}});
            
        } else if (status.toLowerCase() == "started") {
            temp = await CampusDirector.find({}, '-password');
            for(i=0;i<temp.length;i++) {
                if (temp[i]["onGoingTasks"].includes(taskId)) {
                    campusDirectors.push(temp[i]);
                }
            }
        } else if (status.toLowerCase() == "pending") {
            temp = await CampusDirector.find({}, '-password');
            for(i=0;i<temp.length;i++) {
                if (temp[i]["notStartedTasks"].includes(taskId)) {
                    campusDirectors.push(temp[i]);
                }
            }
        } else {
            return next(new RequestError("Wrong status provided!", 400));
        }
    } catch (err) {
        const error = new RequestError('Fetching campus directors failed, please try again later.', 500, err);
        return next(error);
    }
    res.json({"status":"success",campusDirectors: campusDirectors.map(campusDirector => campusDirector.toObject({getters: true}))});
}

// What if user logins from different locations/browsers?
const login = async (req, res, next) => {
    const {email, password} = req.body;
    let existingUser;

    try {
        existingUser = await CampusDirector.findOne({email: email});
    } catch (err) {
        const error = new RequestError("Error occured while findind CD by email", 500, err);
        return next(error);
    }

    if (!existingUser) {
        const error = new RequestError('Unregistered User', 403);
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new RequestError('Could not log in, please check your credentials and try again.', 500);
        return next(error);
    }

    if (!isValidPassword) {
        const error = new RequestError('Incorrect password', 403);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email,},
            process.env.Jwt_Key,
        );
    } catch (err) {
        const error = new RequestError('Logging in failed, please try again later.', 500);
        return next(error);
    }

    await res.json({
        user: existingUser,
        token: token
    });
}

const signUp = async (req, res, next) => {
    return authController.signUp(req, res,next, CampusDirector);
}


exports.getCampusDirectors = getCampusDirectors;
exports.signUp = signUp;
exports.login = login;
exports.getCampusDirectorsByStatus = getCampusDirectorsByStatus;
