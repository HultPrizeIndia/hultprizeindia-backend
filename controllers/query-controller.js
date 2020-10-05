const { validationResult } = require('express-validator');
const RequestError = require('../models/request-error');
const Query = require('../models/query');

const getQueryyId = async (req, res, next) => {
    const queryId = req.params.queryId;
    let query;
    try {
        query = await Query.findById(queryId);
    } catch (err) {
        const error = new RequestError('Fetching query failed, please try again later.', 500, err);
        return next(error);
    }
    if (!query) {
        const error = new RequestError('query not found', 500);
        return next(error);
    }
    await res.json({"status": "success", query: query});
};

const getAllQuery = async (req, res, next) => {
    let queries;
    try {
        queries = await Query.find({});
    } catch (err) {
        const error = new RequestError('Fetching queries failed, please try again later.', 500, err);
        return next(error);
    }
    await res.json({"status": "success", "queries": queries.map(query => query.toObject({getters: true}))});
}

const createQuery = async (req, res, next) => {
    const errors = validationResult(req);
    const raisedBy = req.userData.userId;

    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422, errors)
        );
    }

    const {title, description, comment, raisedFor} = req.body;
    const raiseDate = Date().toLocaleString();
    const query = new Query({
        title,
        description,
        comment,
        raisedBy,
        raisedFor,
        raiseDate
    });
    try {
        await query.save();
    } catch (err) {
        const error = new RequestError("Error creating query", 500, err);
        return next(error);
    }
    res.json({"status": "success", "query":query});

}

const updateQuery = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new RequestError('Invalid Inputs passed', 422, errors)
        );
    }
    const queryId = req.params.queryId;
    const { title, description, comment, raisedFor } = req.body;

    const updatableFields = {
        title, description,
        comment,
        raisedFor,
    };
    try {
        await Query.findByIdAndUpdate(queryId, updatableFields);
    } catch (err) {
        const error = new RequestError("Error fetching query", 500, err);
        return next(error);
    }
    await res
        .status(201)
        .json({"status": "success", "updatedFields": updatableFields});
}

const deleteQuery = async (req, res, next) => {
    const raisedBy = req.userData.userId;
    const queryId = req.params.queryId;
    let query;
    try {
        query = await Query.findById(queryId);
    } catch (err) {
        const error = new RequestError('Fetching query failed, please try again later.', 500, err);
        return next(error);
    }
    if (!query) {
        const error = new RequestError('query not found', 404);
        return next(error);
    }
    try {
        if (raisedBy == query.raisedBy) {
            await Query.deleteOne({_id: queryId});
        } else {
            // Add exception for Admins, currectly Query is deleted only by its creator.
            return res.json({"status": "failed", "message": "invaild queryId for CD"});
        }
    } catch (err) {
        const error = new RequestError('Deleting query failed, please try again later.', 500, err);
        return next(error);
    }
    res.json({"status": "Success", "message": "Query deleted"});
}

const deleteAllQueries = async (req, res, next) => {
    try {
        await Query.deleteMany({});
    } catch (err) {
        const error = new RequestError('Deleting queries failed, please try again later.', 500, err);
        return next(error);
    }
    res.json({"status": "Success", "message": "All queries deleted"});
}


exports.getQueryyId = getQueryyId;
exports.getAllQuery = getAllQuery;
exports.createQuery = createQuery;
exports.updateQuery = updateQuery;
exports.deleteQuery = deleteQuery;
exports.deleteAllQueries = deleteAllQueries;