const express = require('express');
const router = express.Router({ mergeParams: true }); // to support nested routes

const reviewsController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authMiddleware.verifyToken,
    authMiddleware.verifyAuthorization('user'),
    reviewsController.addReview,
  );

router.route('/:reviewId').delete(reviewsController.deleteReviewById);

module.exports = router;
