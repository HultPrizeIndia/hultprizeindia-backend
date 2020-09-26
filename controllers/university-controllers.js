const {validationResult} = require('express-validator');
const RequestError = require('../models/request-error');
const University = require('../models/university');

const getUniversityById = async (req, res, next) => {
    const universityId = req.params.uid;
    let university;
    try {
        university = await University.findById(universityId);
    } catch (err) {
        const error = new RequestError(
            'Fetching university failed, please try again later.',
            500,err
        );
        return next(error);
    }
    await res.json({university: university});
};
const getAllUniversities = async(req,res,next) => {
    let universities;
    try {
        universities = await University.find({});
    } catch (err) {
        const error = new RequestError('Fetching universities failed, please try again later.', 500, err);
        return next(error);
    }
    await res.json({universities: universities.map(university => university.toObject({getters: true}))});
};

const createUniversity = async(req, res,next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422, errors)
        );
    }
};
const updateUniversity = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422, errors)
        );
    }

};

const deleteUniversity = async(req,res, next) => {};
const deleteAllUniversities = async(req,res, next) => {};

exports.getAllUniversities = getAllUniversities;
exports.getUniversityById = getUniversityById;
exports.deleteUniversity = deleteUniversity;
exports.updateUniversity = updateUniversity;
exports.deleteAllUniversities = deleteAllUniversities;
exports.createUniversity = createUniversity;
