import express from 'express';

import { getCurrentUser } from '../middlewares/current-user';

const router = express.Router();

router.route('/api/users/current-user').get(getCurrentUser, (req, res) => {
  /*  if (!req?.currentUser)
    return res.send({ user: null, message: 'user not logged-in' });

  return res.send({
    user: req.currentUser,
    message: 'user logged-in successfully',
  }); */

  return res.send({ user: req?.currentUser || null });
});

export { router as currentUserRouter };
