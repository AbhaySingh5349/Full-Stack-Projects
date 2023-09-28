import { CustomError } from './custom-errors';

export class NotFoundError extends CustomError {
  public statusCode: number = 500;

  constructor() {
    super('Route Not found');

    // since we are extending built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Route Not found' }];
  }
}
