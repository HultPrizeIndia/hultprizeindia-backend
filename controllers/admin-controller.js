

const RequestError = require('../models/request-error');
const Admin = require('../models/admin');
const authController = require('./authentication-controller');

const getAdmins = async (req, res, next) => {
    let admins;
    try {
        admins = await Admin.find({}, '-password');
    } catch (err) {
        const error = new RequestError('Fetching users failed, please try again later.', 500, err);
        return next(error);
    }
    await res.json({"status":"success", admins: admins.map(admin => admin.toObject({getters: true}))});
};

const getAdminById = async (req, res, next) => {
    const adminId = req.params.adminId;
    let admin;
    try {
        admin = await Admin.findById(adminId)
    } catch (err) {
        const error = new RequestError("Something went wrong can't get admin.", 500, err);
        return next(error);
    }
    if (!admin) {
        const error = new RequestError("Can't find admin for provided id", 404);
        return next(error);
    }
    res.status(200).json({
        "status":"success",
        admin: admin.toObject(
            {getters: true}
        )
    });
};

const signUp = async (req, res, next) => {
    return authController.signUp(req, res,next, Admin);
}

const login = async (req,res, next) => {
    return authController.login(req,res,next,Admin);
}
const forgotPassword = async (req,res, next) => {
    console.log("in here");
    return authController.forgotPassword(req,res,next,Admin);
}

const changePassword = async (req,res, next) => {
    return authController.changePassword(req,res,next,Admin);
}

exports.getAdmins = getAdmins;
// exports.editUser = editUser;
exports.signUp = signUp;
exports.login = login;
// exports.login = login;
exports.forgotPassword = forgotPassword;
exports.changePassword = changePassword;
exports.getAdminById = getAdminById;
