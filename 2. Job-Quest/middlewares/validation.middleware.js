import { body, param, validationResult } from "express-validator";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customError.js";

import { JOB_STATUS, JOB_TYPE, USER_TYPE } from "../utils/constants.js";

import mongoose from "mongoose";
import { Job } from "../models/jobs.model.js";
import { User } from "../models/users.model.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }

        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("company is required"),
  body("role").notEmpty().withMessage("role is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid type value"),
  body("jobLocation").notEmpty().withMessage("job location is required"),
]);

const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new Error("invalid MongoDB id");

    const job = await Job.findById(value);
    if (!job) throw new Error(`no job with id ${value}`);

    const isAdmin = req.user.role === "admin"; // admins can access all jobs created by others also
    const isOwner = req.user.userId === job.createdBy.toString(); // person who created job

    if (!isAdmin && !isOwner)
      throw new Error("not authorized to access this route");
  }),
]);

const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new Error("email already exists");
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 2 })
    .withMessage("password must be at least 2 characters long"),
  body("location").notEmpty().withMessage("location is required"),
]);

const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
]);

const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error("email already exists");
      }
    }),
  body("location").notEmpty().withMessage("location is required"),
]);

export {
  withValidationErrors,
  validateJobInput,
  validateIdParam,
  validateRegisterInput,
  validateLoginInput,
  validateUpdateUserInput,
};
