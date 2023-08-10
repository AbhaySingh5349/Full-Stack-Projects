const express = require('express');
const router = express.Router();

const viewsController = require('../controllers/view.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// router.get('/', viewsController.renderBase);

router.use(authMiddleware.isLoggedIn);

router.route('/').get(viewsController.renderOverview);

router
  .route('/tour/:tourSlug')
  .get(authMiddleware.verifyToken, viewsController.renderTour);

router.get('/login', viewsController.getLoginForm);

module.exports = router;
