// to define all the properties that must be defined by any class that extends "CustomError abstract class"
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(public logMessage: string) {
    super(logMessage);

    // since we are extending built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // not defining method but just its signature which returns array of objects
  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}

// super keyword is equivalent to => new Error('');
