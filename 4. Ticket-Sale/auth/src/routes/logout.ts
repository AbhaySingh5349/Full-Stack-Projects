import express from 'express';

const router = express.Router();

router.post('/api/users/logout', (req, res) => {
  if (!req.session?.jwt)
    return res.send({ user: null, message: 'user not logged-in' });

  req.session = null;

  return res.send('user logged out successfully');
});

export { router as logoutRouter };
