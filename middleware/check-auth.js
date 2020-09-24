const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');
const RequestError = require('../models/request-error');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed! token does not exist');
    }
    let tokenBlacklisted = await Blacklist.findOne({
      "token": token
    }) != null;

    if(!tokenBlacklisted) {
      const decodedToken = jwt.verify(token, process.env.Jwt_Key);


      const currentDate = Math.round(new Date() / 1000);
      if (currentDate > decodedToken.expiry) {
        // Token is expired
        const error = new RequestError('Expired token!', 403);
        return next(error);
      }

      req.userData = { userId: decodedToken.userId };
      next();
      
  } else {
      const error = new RequestError('Authentication failed!', 403);
      return next(error);
    }
  } catch (err) {
      const error = new RequestError('Authentication failed!', 403, err);
    return next(error);
  }
};
