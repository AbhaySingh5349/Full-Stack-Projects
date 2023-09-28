import express, { Request, Response, Router } from 'express';

import { validateRegisterInput } from '../middlewares/validation-middleware';

const router = express.Router();

router
  .route('/api/users/register')
  .post(validateRegisterInput, (req: Request, res: Response) => {
    return res.send('hi register endpoint');
  });

export { router as registerRouter };
