const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');
const catchAsync = require('../helpers/catchAsync');

// token is retrieved from authorization header and check if its valid

/*const verifyToken = async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'JWT'
  ) {
    try {
      const decoded = jwt.verify(
        req.headers.authorization.split(' ')[1],
        config.jwt.secret,
      );

      console.log('decoded: ', decoded);

      req.user = await User.findById(decoded.sub);
      req.authMessage = 'User validated';
      next();
    } catch (err) {
      console.log('err: ', err);
      req.user = null;
      req.authMessage = 'Invalid JWT token: ' + err;
      next();
    }
  } else {
    req.user = null;
    req.authMessage = 'Authorization Header not found';
    next();
  }
}; */

const verifyToken = catchAsync(async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    // Verify Token
    const decoded = jwt.verify(
      req.headers.authorization.split(' ')[1],
      config.jwt.secret,
    );
    console.log('decoded: ', decoded);

    // Verify if user still exists in db
    const user = await User.findById({ _id: decoded.sub });
    if (!user || user.isPasswordChangedAfterTokenGeneration(decoded.iat)) {
      req.user = null;
      req.authMessage = user
        ? 'Password changed since previous login. Please login again'
        : 'User not found';
    } else {
      req.user = user;
      req.authMessage = 'User validated';
    }
  } else {
    req.user = null;
    req.authMessage = 'Authorization Header not found';
  }

  next();
});

// we normally cannot pass arguements in middleware functions, so we create a wrapper which accepts parameter & returns middleware we want to create
const verifyAuthorization = (...restrictedRoles) => {
  return catchAsync(async (req, res, next) => {
    console.log('restrictedRoles: ', restrictedRoles);
    if (req?.user && restrictedRoles.includes(req.user.role)) {
      req.user.isAuthorized = true;
    } else {
      req.authMessage = req?.user ? 'User is not authorized' : req.authMessage;
      req.statusCode = req?.user ? 403 : 401;
      // req.user.isAuthorized = false;
    }

    next();
  });
};

module.exports = {
  verifyToken,
  verifyAuthorization,
};
