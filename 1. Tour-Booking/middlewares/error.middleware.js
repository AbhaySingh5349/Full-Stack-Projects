const config = require('../config/config');
const apiError = require('../helpers/apiErrors');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'failure';

  console.log('config.node_env: ', config.node_env);

  if (config.node_env === 'development') {
    apiError.sendErrorDev(err, res);
  } else if (config.node_env === 'production') {
    // we need to handle 'mongoose validation errors' explicitly and send informative error to client

    let custom_err = { ...err };
    if (err.name === 'CastError') {
      // mismatch or failure during value casting or conversion (eg. search with ID: 123, wewew)
      custom_err = apiError.handleCastErrorDb(custom_err);
    } else if (err.code === 11000) {
      // entered duplicate data for fields which were supposed to be unique
      custom_err = apiError.handleDuplicateFieldsDB(custom_err);
    } else if (err.name === 'ValidationError') {
      // entered values which is are not accepted
      custom_err = apiError.handleValidationErrorDB(custom_err);
    } else if (err.name === 'JsonWebTokenError') {
      custom_err = apiError.handleJWTError(custom_err);
    } else if (err.name === 'TokenExpiredError') {
      custom_err = apiError.handleJWTExpiredError(custom_err);
    }

    apiError.sendErrorProd(custom_err, res);
  }
  next();
};

module.exports = {
  errorHandler,
};
