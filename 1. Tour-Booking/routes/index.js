const express = require('express');
const router = express.Router();

const apiError = require('../helpers/apiErrors');
const errorMiddleware = require('../middlewares/error.middleware');

const toursRoute = require('./tours.route');
router.use('/tours', toursRoute);

const authRoute = require('./auth.route');
router.use('/auth', authRoute);

const usersRoute = require('./user.route');
router.use('/users', usersRoute);

// if we are able to reach here means request-response cycle was not yet finsihed, so this is some invalid route
router.all('*', (req, res, next) => {
  // if 'next' func. receives any arguement, express interpret it as error, skips all middlewares in stack & send error to global error handling middleware
  next(
    new apiError.APIErrorClass(
      404,
      `Can't find ${req.originalUrl} on this server!`,
    ),
  );
});

// error handling middleware
router.use(errorMiddleware.errorHandler);

module.exports = router;
