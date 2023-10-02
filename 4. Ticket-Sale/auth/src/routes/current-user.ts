import express, { Request, Response } from 'express';

// import { getCurrentUser } from '../middlewares/current-user';
import { getCurrentUser } from '@abticketsale/common';

const router = express.Router();

router
  .route('/api/users/current-user')
  .get(getCurrentUser, (req: Request, res: Response) => {
    /*  if (!req?.currentUser)
    return res.send({ user: null, message: 'user not logged-in' });

  return res.send({
    user: req.currentUser,
    message: 'user logged-in successfully',
  }); */

    return res.send({ user: req?.currentUser || null });
  });

export { router as currentUserRouter };
