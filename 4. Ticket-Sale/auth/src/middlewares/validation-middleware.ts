import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/req-validation-errors';

type ValidateValuesType = ((
  req: Request,
  res: Response,
  next: NextFunction
) => void)[];

const withValidationErrors = (validateValues: ValidateValuesType) => {
  return [
    ...validateValues,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      next();
    },
  ];
};

const validateRegisterInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('password must be at least 2 characters long'),
]);

export { withValidationErrors, validateRegisterInput };
