import { CustomError } from './custom-errors';

export class DBConnectionError extends CustomError {
  public statusCode: number = 500;
  public reason: string = 'Error Connecting to DB';

  constructor() {
    super('Error Connecting to DB');

    // since we are extending built in class
    Object.setPrototypeOf(this, DBConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
