// const {validationResult} = require('express-validator');
// const bcrypt = require('bcryptjs');
// const mailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport');
// const jwt = require('jsonwebtoken');

const HttpError = require('../models/request-error');
const CampusDirector = require('../models/campus-director');

const getCampusDirectors = async (req, res, next) => {
    let campusDirectors;
    try {
        campusDirectors = await CampusDirector.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching campus directors failed, please try again later.',
            500
        );
        return next(error);
    }
    await res.json({campusDirectors: campusDirectors.map(campusDirector => campusDirector.toObject({getters: true}))});
};


exports.getCampusDirectors = getCampusDirectors;
