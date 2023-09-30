import express, { Request, Response } from 'express';

import { createJWT } from '../services/token';
import { validateLoginInput } from '../middlewares/validation-middleware';
import { User } from '../models/user-model';
import { BadRequestError } from '../errors/bad-req-errors';
import { PasswordManager } from '../services/password-manager';

const router = express.Router();

router
  .route('/api/users/login')
  .post(validateLoginInput, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const isValidUser =
      user && (await PasswordManager.compare(user.password, password));

    if (!isValidUser) throw new BadRequestError('invalid credentials');

    // generate JWT
    const token = createJWT({ id: user.id, email });

    // store JWT on session object (it got turned into JSON and then base 64 encoded)
    req.session = {
      jwt: token,
    };

    return res.status(200).send({ user });
  });

export { router as loginRouter };
