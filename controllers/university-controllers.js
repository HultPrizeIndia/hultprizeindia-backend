// const {validationResult} = require('express-validator');
// const bcrypt = require('bcryptjs');
// const mailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport');
// const jwt = require('jsonwebtoken');

const RequestError = require('../models/request-error');
const University = require('../models/university');

// const getTasks = async (req, res, next) => {
//     let campusDirectors;
//     try {
//         campusDirectors = await Task.find({}, '-password');
//     } catch (err) {
//         const error = new HttpError(
//             'Fetching campus directors failed, please try again later.',
//             500
//         );
//         return next(error);
//     }
//     await res.json({campusDirectors: campusDirectors.map(campusDirector => campusDirector.toObject({getters: true}))});
// };


// exports.getCampusDirectors = getTasks;
