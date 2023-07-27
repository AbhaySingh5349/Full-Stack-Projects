const express = require('express');
const toursController = require('../controllers/tours.controller');
const { toursMiddleware, authMiddleware } = require('../middlewares');
const reviewsRouter = require('./review.route');

const router = express.Router();

router.route('/').get(toursController.fetchAllTours);

router.route('/stats').get(toursController.getTourStats);

router
  .route('/tours-within-radius/:distance/center/:latlng/unit/:unit')
  .get(toursController.getToursWithinRadius);

router
  .route('/tourDistancesFromPoint/:latlng/unit/:unit')
  .get(toursController.getDistancesOfAllToursFromPoint);

router.use(authMiddleware.verifyToken); // authentication added to all successive routes

router
  .route('/top-5-places')
  .get(toursMiddleware.aliasTopPlaces, toursController.fetchAllTours);

router
  .route('/monthly-plan/:year')
  .get(
    authMiddleware.verifyAuthorization('admin', 'lead-guide', 'guide'),
    toursController.getMonthlyPlan,
  );

router.use(authMiddleware.verifyAuthorization('admin', 'lead-guide')); // authorization for 'aadmin & lead-guide' for all successive routes

router.route('/').post(toursController.addTour);

router
  .route('/:tourId')
  .get(toursController.fetchTourWithId)
  .patch(toursController.updateTourWithId)
  .delete(toursController.deleteTourWithId);

// nested route
router.use('/:tourId/reviews', reviewsRouter);

module.exports = router;
