const catchAsync = require('../helpers/catchAsync');
const apiError = require('../helpers/apiErrors');

const reviewService = require('../services/review.service');

const getAllReviews = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviewsObj = await reviewService.getAllReviews(filter);

  return res.status(200).send(reviewsObj);
});

const addReview = catchAsync(async (req, res) => {
  if (!req?.user || !req.user?.isAuthorized) {
    throw new apiError.APIErrorClass(
      req?.statusCode ? req.statusCode : 401,
      req?.authMessage ?? 'error',
    );
  }

  // nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  const reviewObj = await reviewService.addReview(req.body);

  return res.status(201).send(reviewObj);
});

const deleteReviewById = catchAsync(async (req, res) => {
  // if (!req?.user || !req.user?.isAuthorized) {
  //   throw new apiError.APIErrorClass(
  //     req?.statusCode ? req.statusCode : 401,
  //     req?.authMessage ?? 'error',
  //   );
  // }

  await reviewService.deleteReviewById(String(req.params.reviewId));

  return res.status(204).send({});
});

module.exports = {
  getAllReviews,
  addReview,
  deleteReviewById,
};
