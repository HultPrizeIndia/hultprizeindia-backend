const {validationResult} = require('express-validator');
const RequestError = require('../models/request-error');
const Referral = require('../models/referral');

const getReferralById = async (req, res, next) => {
    const referralId = req.params.referralId;
    let referral;
    try {
        referral = await Referral.findById(referralId);
    } catch (err) {
        const error = new RequestError(
            'Fetching referral failed, please try again later.',
            500, err
        );
        return next(error);
    }
    if (!referral) {
        const error = new RequestError(
            'Referral not found',
            500
        );
        return next(error);
    }
    await res.json({"status": "success", referral: referral});
};

const getAllReferrals = async (req, res, next) => {
    let referrals;
    try {
        referrals = await Referral.find({});
    } catch (err) {
        const error = new RequestError('Fetching referrals failed, please try again later.', 500, err);
        return next(error);
    }
    await res.json({"status": "success", referrals: referrals.map(referral => referral.toObject({getters: true}))});
};

const createReferral = async (req, res, next) => {
    const errors = validationResult(req);
    const referredBy = req.userData.userId;
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422, errors)
        );
    }

    const {name, description, email, mobile,} = req.body;
    const referralDate = Date().toLocaleString();
    const referral = new Referral({
        name,
        referredBy,
        description,
        email,
        mobile,
        referralDate
    });
    try {
        await referral.save();
    } catch (err) {
        const error = new RequestError("Error creating referral", 500, err);
        return next(error);
    }
    res.json({"status": "success", referral});
};

const updateReferral = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422, errors)
        );
    }
    const referralId = req.params.referralId;
    const {
        name, description,
        email,
        mobile,
    } = req.body;

    const updatableFields = {
        name, description,
        email,
        mobile,
    };
    try {
        await Referral.findByIdAndUpdate(referralId, updatableFields);
    } catch (err) {
        const error = new RequestError("Error fetching referral", 500, err);
        return next(error);
    }
    await res
        .status(201)
        .json({"status": "success", updatedFields: updatableFields,});
};

const deleteReferral = async (req, res, next) => {
    const referralId = req.params.referralId;
    let referral;
    try {
        referral = await Referral.findById(referralId);
    } catch (err) {
        const error = new RequestError('Fetching referral failed, please try again later.', 500, err);
        return next(error);
    }
    if (!referral) {
        const error = new RequestError('Referral not found', 404);
        return next(error);
    }
    try {
        await Referral.deleteOne({_id: referralId});
    } catch (err) {
        const error = new RequestError('Deleting task failed, please try again later.', 500, err);
        return next(error);
    }
    res.json({"status": "Success", message: "Referral deleted"});
};

const deleteAllReferrals = async (req, res, next) => {
    try {
        await Referral.deleteMany({});
    } catch (err) {
        const error = new RequestError('Deleting referrals failed, please try again later.', 500, err);
        return next(error);
    }
    res.json({"status": "Success", message: "All referrals deleted"});
};

exports.getAllReferrals = getAllReferrals;
exports.getReferralById = getReferralById;
exports.deleteReferral = deleteReferral;
exports.updateReferral = updateReferral;
exports.deleteAllReferrals = deleteAllReferrals;
exports.createReferral = createReferral;
