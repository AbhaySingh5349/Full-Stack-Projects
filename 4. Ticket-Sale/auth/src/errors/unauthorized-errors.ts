import { CustomError } from './custom-errors';

export class UnauthorizedError extends CustomError {
  public statusCode: number = 401;

  constructor() {
    super('Not authorized');

    // since we are extending built in class
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
