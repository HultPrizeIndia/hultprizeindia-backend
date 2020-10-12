const {validationResult} = require('express-validator');
// const bcrypt = require('bcryptjs');
// const mailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport');
// const jwt = require('jsonwebtoken');

const RequestError = require('../middleware/request-error');
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
    await res.json({
        "status": "success",
        campusDirectors: campusDirectors.map(campusDirector => campusDirector.toObject({getters: true}))
    });
};

const getCampusDirectorsByStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let params = "";
        errors.array().forEach((e) => {
            params += `${e.param}, `
        });
        params += "triggered the error!!";
        return next(
            new RequestError(params, 422)
        );
    }

    const {taskId, status} = req.body;
    // const id = mongoose.Types.ObjectId(taskId);
    let campusDirectors = [];
    let temp;
    try {
        if (status.toLowerCase() === "completed") {

            temp = await CampusDirector.find({}, '-password');
            for (i = 0; i < temp.length; i++) {
                if (temp[i]["completedTasks"].includes(taskId)) {
                    campusDirectors.push(temp[i]);
                }
            }
        } else if (status.toLowerCase() === "started") {
            temp = await CampusDirector.find({}, '-password');
            for (i = 0; i < temp.length; i++) {
                if (temp[i]["onGoingTasks"].includes(taskId)) {
                    campusDirectors.push(temp[i]);
                }
            }
        } else if (status.toLowerCase() === "pending") {
            temp = await CampusDirector.find({}, '-password');
            for (i = 0; i < temp.length; i++) {
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
    res.json({
        "status": "success",
        campusDirectors: campusDirectors.map(campusDirector => campusDirector.toObject({getters: true}))
    });
}

// What if user logins from different locations/browsers?


const signUp = async (req, res, next) => {
    return authController.signUp(req, res, next, CampusDirector);
}

const login = async (req, res, next) => {
    return authController.login(req, res, next, CampusDirector);
}

const forgotPassword = async (req, res, next) => {
    return authController.forgotPassword(req, res, next, CampusDirector);
}

const changePassword = async (req, res, next) => {
    return authController.changePassword(req, res, next, CampusDirector);
}

const deleteCD = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let params = "";
        errors.array().forEach((e) => {
            params += `${e.param}, `
        });
        params += "triggered the error!!";
        return next(
            new RequestError(params, 422)
        );
    }
    const {email} = req.body;
    let campusDirector;
    try {
        campusDirector = await CampusDirector.findOne({email: email}, "-password");
    } catch (err) {
        next(new RequestError("Error finding campusDirector by Email", 500, err));
    }

    if (!campusDirector) {
        next(new RequestError("CampusDirector does not exist!", 500, err));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await campusDirector.remove();
        await sess.commitTransaction();
    } catch (err) {
        next(new RequestError("Error removing CD", 500, err));
    }

    await res.json({
        "status": "success",
        "campusdirector": campusDirector
    })

}


exports.getCampusDirectors = getCampusDirectors;
exports.signUp = signUp;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.changePassword = changePassword;
exports.getCampusDirectorsByStatus = getCampusDirectorsByStatus;
exports.deleteCD = deleteCD;