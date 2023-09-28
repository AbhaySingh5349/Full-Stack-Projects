import express from 'express';

const router = express.Router();

router.post('/api/users/logout', (req, res) => {
  res.send('hi logout endpoint');
});

export { router as logoutRouter };
