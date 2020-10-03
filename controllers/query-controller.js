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
    await res.json({"status": "success", referrals: referrals.map(referral => referral.toObject({getters: true}))});
}


exports.getQueryyId = getQueryyId;
exports.getAllQuery = getAllQuery;