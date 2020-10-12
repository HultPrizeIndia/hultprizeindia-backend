const {validationResult} = require('express-validator');
const RequestError = require('../middleware/request-error');
const University = require('../models/university');

const getUniversityById = async (req, res, next) => {
    const universityId = req.params.universityId;
    let university;
    try {
        university = await University.findById(universityId);
    } catch (err) {
        const error = new RequestError(
            'Fetching university failed, please try again later.',
            500, err
        );
        return next(error);
    }
    if (!university) {
        const error = new RequestError(
            'University not found',
            500
        );
        return next(error);
    }
    await res.json({"status":"success",university: university});
};
const getAllUniversities = async (req, res, next) => {
    let universities;
    try {
        universities = await University.find({});
    } catch (err) {
        const error = new RequestError('Fetching universities failed, please try again later.', 500, err);
        return next(error);
    }
    await res.json({"status":"success",universities: universities.map(university => university.toObject({getters: true}))});
};

const createUniversity = async (req, res, next) => {
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

    const {name, state, city} = req.body;

    const university = new University({
        name,
        city,
        state
    });
    try {
        await university.save();
    } catch (err) {
        const error = new RequestError("Error creating university", 500, err);
        return next(error);
    }
    res.json({"status":"success",university});
};
const updateUniversity = async (req, res, next) => {
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
    const universityId = req.params.universityId;
    const {name, state, city} = req.body;

    const updatableFields = {
        name, state, city
    };
    try {
        await University.findByIdAndUpdate(universityId, updatableFields);
    } catch (err) {
        const error = new RequestError("Error fetching university", 500, err);
        return next(error);
    }
    await res
        .status(201)
        .json({"status": "success", updatedFields: updatableFields,});
};

const deleteUniversity = async (req, res, next) => {
    const universityId = req.params.universityId;
    let university;
    try {
        university = await University.findById(universityId);
    } catch (err) {
        const error = new RequestError('Fetching university failed, please try again later.', 500, err);
        return next(error);
    }
    if (!university) {
        const error = new RequestError('University not found', 404);
        return next(error);
    }
    try {
        await University.deleteOne({_id: universityId});
    } catch (err) {
        const error = new RequestError('Deleting task failed, please try again later.', 500, err);
        return next(error);
    }
    res.json({"status": "Success", message: "University deleted"});
};

const deleteAllUniversities = async (req, res, next) => {
    try {
        await University.deleteMany({});
    } catch (err) {
        const error = new RequestError('Deleting universities failed, please try again later.', 500, err);
        return next(error);
    }
    res.json({"status": "Success", message: "All universities deleted"});
};

exports.getAllUniversities = getAllUniversities;
exports.getUniversityById = getUniversityById;
exports.deleteUniversity = deleteUniversity;
exports.updateUniversity = updateUniversity;
exports.deleteAllUniversities = deleteAllUniversities;
exports.createUniversity = createUniversity;
