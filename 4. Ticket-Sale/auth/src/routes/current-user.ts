import express from 'express';

const router = express.Router();

router.get('/api/users/current-user', (req, res) => {
  res.send('hi current-user endpoint');
});

export { router as currentUserRouter };
