// const {validationResult} = require('express-validator');
// const bcrypt = require('bcryptjs');
// const mailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport');
// const jwt = require('jsonwebtoken');

const RequestError = require('../middleware/request-error');
const Live = require('../models/live');

// const getTasks = async (req, res, next) => {
//     let campusDirectors;
//     try {
//         campusDirectors = await Task.find({}, '-password');
//     } catch (err) {
//         const error = new RequestError(
//             'Fetching campus directors failed, please try again later.',
//             500,
//             err
//         );
//         return next(error);
//     }
//     await res.json({"status":"success",campusDirectors: campusDirectors.map(campusDirector => campusDirector.toObject({getters: true}))});
// };


// exports.getCampusDirectors = getTasks;
