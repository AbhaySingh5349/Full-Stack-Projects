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
  let token;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('token from authorization');
  } else if (req.cookies?.jwt_access_cookie) {
    token = req.cookies.jwt_access_cookie.value;
    console.log('token from cookie: ', token);
  }

  if (!token) {
    req.user = null;
    req.authMessage = 'Authorization Header and Cookies not found';
  } else {
    // Verify Token
    const decoded = jwt.verify(token, config.jwt.secret);
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

// only for rendered pages & goal here is not to protect any route
const isLoggedIn = catchAsync(async (req, res, next) => {
  const token = req.cookies?.jwt_access_cookie?.value ?? null;
  console.log('token from cookie for rendered pages: ', token);

  if (token) {
    // Verify Token
    const decoded = jwt.verify(token, config.jwt.secret);
    console.log('decoded: ', decoded);

    // Verify if user still exists in db
    const user = await User.findById({ _id: decoded.sub });
    if (!user || user.isPasswordChangedAfterTokenGeneration(decoded.iat)) {
      return next();
    }

    // making 'user' accessible to templates (little bit like passing data to templates while rendering)
    res.locals.user = user;
    next();
  }
  next();
});

module.exports = {
  verifyToken,
  verifyAuthorization,
  isLoggedIn,
};
