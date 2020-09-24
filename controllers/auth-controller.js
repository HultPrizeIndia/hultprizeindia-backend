
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const mailer = require('nodemailer');

const RequestError = require("../models/request-error");

const validationResult = require("express-validator").validationResult;
const Admin = require("../models/admin");
const CD = require("../models/campus-director");

const signUp = async (req, res, next, dbType) => {
    if (dbType == Admin) {
        console.log("DBTYPE IS ADMIN");
    } else if (dbType == CD) {
        const uni = req.body.uni;
        if (!uni) {
            const error = new RequestError(err.message, 500);
            return next(error);
        }
    }


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422)
        );
    }



    const {firstName, lastName, email, password, mobile} = req.body;
    let existingUser;
    try {
        existingUser = await dbType.findOne({email: email});
    } catch (err) {
        const error = new RequestError("Error quering database", 500, err);

        return next(error);
    }

    if (existingUser) {
        const error = new RequestError('User exists already, please login instead.',422);
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new RequestError('Could not create user, please try again.', 500, err);
        return next(error);
    }
    const date = Date().toLocaleString();


    // let filePath;
    // try {
    //     if (req.file) {
    //         filePath = req.file.path;
    //     } else {
    //         filePath = 'uploads/images/DUser.jpeg'
    //     }
    // } catch (err) {
    //     console.log(err);
    //     const error = new RequestError(err.message, err.code, err);
    //     return next(error);
    // }

    const createdUser = new dbType({
        firstName,
        lastName,
        email,
        // image: 'https://win75.herokuapp.com/' + filePath,
        password: hashedPassword,
        mobile,
        joinDate: date,
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new RequestError("Error creating user", 500, err);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            {userId: createdUser.id, email: createdUser.email},
            process.env.Jwt_Key,
        );
    } catch (err) {
        const error = new RequestError('Signing up failed, please try again later.', 500, err);
        return next(error);
    }

    await res
        .status(201)
        .json({user: createdUser, email: createdUser.email, token: token});
};

exports.signUp = signUp;