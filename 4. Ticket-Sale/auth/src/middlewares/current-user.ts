import { Request, Response, NextFunction } from 'express';

import { verifyJWT } from '../services/token';

// for TS to understand what are we actually assigning to "typed obj"
interface UserPayload {
  id: string;
  email: string;
}

// find interface with name "Request" which is an existing Type definition and adding conditional property to it
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) return next();

  try {
    const payload = verifyJWT(req.session.jwt) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    // return res.send({ user: null, message: 'user not logged-iniii', err });
  }

  next();
};
