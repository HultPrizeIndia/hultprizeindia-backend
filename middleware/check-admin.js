const Admin = require('../models/admin');
const RequestError = require('./request-error');

module.exports = async (req, res, next) => {
    const adminId = req.userData.userId;
    let existingAdmin;
    try {
        existingAdmin = await Admin.findById(adminId);
    } catch (err) {
        const error = new RequestError("Error querying database", 500, err);
        return next(error);
    }

    if (!existingAdmin) {
        const error = new RequestError('Unauthorized admin-only request', 422);
        return next(error);
    }
    else {
        next();
    }
};