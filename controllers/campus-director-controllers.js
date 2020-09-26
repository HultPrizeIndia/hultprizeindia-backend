// const {validationResult} = require('express-validator');
// const bcrypt = require('bcryptjs');
// const mailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport');
// const jwt = require('jsonwebtoken');

const RequestError = require('../models/request-error');
const CampusDirector = require('../models/campus-director');
const authController = require('./authentication-controller');


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

const signUp = async (req, res, next) => {
    return authController.signUp(req, res,next, CampusDirector);
}


exports.getCampusDirectors = getCampusDirectors;
exports.signUp = signUp;
