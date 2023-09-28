import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-errors';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  return res
    .status(500)
    .send({ errors: [{ message: 'something went wrong' }] });
};

export { errorHandler };

/*
{
  type: 'field',
  value: 'a@gmail.',
  msg: 'invalid email format',
  path: 'email',
  location: 'body'
}
*/

// common response structure
/*{
    errors:{
        message: string,
        field?: string
    }[]
} 
*/
/* we need to do "implements CustomError" for each Error class we created or we can use Abstract class
interface CustomError{
    statusCode: number;
    serializeErrors():{
        message: string,
        field?: string
    }[]
  }
*/
