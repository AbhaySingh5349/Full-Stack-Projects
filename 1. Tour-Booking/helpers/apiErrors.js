class APIErrorClass extends Error {
  constructor(statusCode, message, stack = '') {
    super(message); // to call parent (Error class) constructor

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failure' : 'error';
    this.isOperational = true; // all custom errors we create by ourselves will be operational errors which we want to send to client for production

    if (stack) {
      this.stack = stack;
    } else {
      // when a new object is created & constructor function is called, then that func call will not appear in stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // programming or other unknown error (dont want details leak to client)
  console.error('ERROR 🎆:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something Went Wrong !!',
  });
};

const handleCastErrorDb = (err) => {
  // 'path' holds name of field for which 'value' actual i/p data is in wrong format
  const message = `Invalid propetry: ${err.path} and value: ${err.value}.`;

  return new APIErrorClass(400, message);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${JSON.stringify(
    err.keyValue,
  )}. Please use another value!`;

  return new APIErrorClass(400, message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((field) => field.message);
  const message = `Invalid input data : ${errors.join('. ')}`;

  return new APIErrorClass(400, message);
};

const handleJWTError = (err) => {
  return new APIErrorClass(401, `${err.message}! Please log in again!`);
};

const handleJWTExpiredError = (err) => {
  return new APIErrorClass(401, `${err.message}! Please log in again.`);
};

module.exports = {
  APIErrorClass,
  sendErrorDev,
  sendErrorProd,
  handleCastErrorDb,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
  handleJWTError,
  handleJWTExpiredError,
};
