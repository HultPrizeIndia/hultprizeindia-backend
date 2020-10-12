const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');
const RequestError = require('./request-error');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new RequestError('Authentication failed! token does not exist',404);
    }
    let tokenBlacklisted = await Blacklist.findOne({
      "token": token
    }) != null;

    if(!tokenBlacklisted) {
      const decodedToken = jwt.verify(token, process.env.Jwt_Key);
      req.userData = { userId: decodedToken.userId };
      next();
      
  } else {
      const error = new RequestError('Authentication failed!', 403);
      return next(error);
    }
  } catch (err) {
    const error = new RequestError("Token not sent!", 403);
    return next(error);
  }
};
