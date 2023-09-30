import express, { Request, Response } from 'express';

import { createJWT } from '../services/token';
import { validateRegisterInput } from '../middlewares/validation-middleware';
import { User } from '../models/user-model';
import { BadRequestError } from '../errors/bad-req-errors';

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

    // store JWT on session object (it got turned into JSON and then base 64 encoded)
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
