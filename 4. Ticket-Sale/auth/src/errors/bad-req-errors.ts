import { CustomError } from './custom-errors';

export class BadRequestError extends CustomError {
  public statusCode: number = 500;

  constructor(public message: string) {
    super(message);

    // since we are extending built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
