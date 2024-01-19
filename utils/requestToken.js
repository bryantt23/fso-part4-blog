const User = require('../models/user');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  try {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.substring(7);
      const decodedToken = jwt.verify(token, process.env.SECRET);

      if (decodedToken && decodedToken.id) {
        request.user = await User.findById(decodedToken.id);
      } else {
        request.user = null;
      }
    }
  } catch (error) {
    next(error);
  }
  next();
};

module.exports = {
  tokenExtractor,
  userExtractor
};
