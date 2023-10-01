import express, { Request, Response } from 'express';

import { User } from '../models/user-model';
import {
  createJWT,
  validateRegisterInput,
  BadRequestError,
} from '@abticketsale/common';

const router = express.Router();

router
  .route('/api/users/register')
  .post(validateRegisterInput, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new BadRequestError('email already exists');

    const user = User.build({ email, password });
    await user.save();

    // generate JWT
    const token = createJWT({ id: user.id, email });

    // store JWT on session object (it got turned into JSON and then base 64 encoded string by cookie session)
    req.session = {
      jwt: token,
    };

    // res.cookie('jwt_cookie', token, {
    //   httpOnly: true,
    //   expires: new Date(Date.now() + 1 * 60 * 1000),
    // });

    return res.status(201).send({ user });
  });

export { router as registerRouter };
