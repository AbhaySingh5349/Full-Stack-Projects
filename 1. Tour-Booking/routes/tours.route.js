const express = require('express');
const toursController = require('../controllers/tours.controller');
const { toursMiddleware, authMiddleware } = require('../middlewares');
const reviewsRouter = require('./review.route');

const router = express.Router();

router
  .route('/')
  .get(authMiddleware.verifyToken, toursController.fetchAllTours)
  .post(toursController.addTour);

router.route('/stats').get(toursController.getTourStats);

router
  .route('/top-5-places')
  .get(
    authMiddleware.verifyToken,
    toursMiddleware.aliasTopPlaces,
    toursController.fetchAllTours,
  );

router.route('/monthly-plan/:year').get(toursController.getMonthlyPlan);

router
  .route('/:tourId')
  .get(toursController.fetchTourWithId)
  .patch(toursController.updateTourWithId)
  .delete(
    authMiddleware.verifyToken,
    authMiddleware.verifyAuthorization('admin', 'lead-guide'),
    toursController.deleteTourWithId,
  );

// nested route
router.use('/:tourId/reviews', reviewsRouter);

module.exports = router;
