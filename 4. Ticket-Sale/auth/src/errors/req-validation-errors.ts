import { ValidationError } from 'express-validator';
import { CustomError } from './custom-errors';

export class RequestValidationError extends CustomError {
  public statusCode: number = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // since we are extending built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      if (error.type === 'field') {
        return { message: error.msg, field: error.path };
      }
      return { message: error.msg };
    });
  }
}
