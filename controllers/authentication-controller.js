
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
// const mailer = require('nodemailer');

const RequestError = require("../models/request-error");

const validationResult = require("express-validator").validationResult;
// const Admin = require("../models/user");
const CD = require("../models/campus-director");


// signUp
const signUp = async (req, res, next, dbType) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422)
        );
    }



    const {firstName, lastName, email, password, mobile,university} = req.body;
    let existingUser;
    try {
        existingUser = await dbType.findOne({email: email});
    } catch (err) {
        const error = new RequestError("Error querying database", 500, err);
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
        university,
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
            process.env.Jwt_Key,{
                expiresIn: '2d' // expires in 2d
            }
        );
    } catch (err) {
        const error = new RequestError('Signing up failed, please try again later.', 500, err);
        return next(error);
    }

    await res
        .status(201)
        .json({"status":"success",user: createdUser, email: createdUser.email, token: token});
};

// login
const login = async (req, res, next, dbType) => {
    const {email, password} = req.body;

    let existingUser;

    try {
        existingUser = await dbType.findOne({email: email});
    } catch (err) {
        const error = new HttpError(
            err.message,
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError(
            'You are not registered!!!',
            403
        );
        return next(error);
        // res.json(
        //     {error: error, existingUser}
        // );
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Wrong Password!!',
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email,},
            process.env.Jwt_Key,
        );
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    await res.json({
        user: existingUser,
        token: token
    });
};

const forgotPassword = async (req, res, next, dbType) => {
    const email = req.params.email;
    let password = Math.random().toString().substring(0, 3) + Math.random().toString().slice(0, 3) + 'win';
    let user;
    try {
        user = await dbType.findOne({
            email
        });
    } catch (err) {
        const error = new HttpError("Something went wrong, please try again later.", err.status);
        return next(error);
    }
    if (!user) {
        const error = new HttpError(
            'You are not registered!!!',
            403
        );
        return next(error);
    }
    try{
        await sendMail(password, email);
    }catch (err){
        const error = new HttpError(
            'Error in sending mail!!!',
            500
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    }
    user.password = hashedPassword;
    try {
        await user.save();
    } catch (err) {
        const error = new HttpError("Error saving user, try again later.", err.status);
        return next(error);
    }

    res.status(200).json({
        message: "Password updated"
    });

};

const changePassword = async (req, res, next , dbType) => {
    const userId = req.userData.userId;
    console.log(userId);
    let user;
    try {
        user = await dbType.findById(userId)
    } catch (err) {
        const error = new HttpError("Something went wrong can't get user.", 500);
        return next(error);
    }
    if (!user) {
        const error = new HttpError("Can't find user for provided id", 404);
        return next(error);
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const newPassword = req.body.newPassword;
    const currentPassword = req.body.currentPassword;
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(currentPassword, user.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Wrong Password!!',
            403
        );
        return next(error);
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not update password, please try again.',
            500
        );
        return next(error);
    }
    user.password = hashedPassword;
    try {
        await user.save();
    } catch (err) {
        const error = new HttpError("Error saving user, try again later.", err.status);
        return next(error);
    }

    res.status(200).json({
        message: "Password updated"
    });
};

exports.forgotPassword = forgotPassword;
exports.changePassword = changePassword;
exports.signUp = signUp;
exports.login = login;
