const { Review } = require('../models');
const apiError = require('../helpers/apiErrors');

const getAllReviews = async (tourIdFilter) => {
  const reviews = await Review.find(tourIdFilter);
  if (!reviews) {
    throw new apiError.APIErrorClass(500, 'Failed to fetch all reviews');
  }

  return {
    reviews,
    message: 'Reviews fetched successfully',
  };
};

const addReview = async (reviewBody) => {
  const review = await Review.create(reviewBody);

  return {
    status: 'success',
    review,
    message: 'Review Added Successfully!',
  };
};

const updateReviewById = async (id, reviewBody) => {
  const review = await Review.findByIdAndUpdate(id, reviewBody, {
    new: true, // returns updated object
    runValidators: true,
  });
  if (!review) {
    throw new apiError.APIErrorClass(404, `No review with id:${id} found`);
  }
  return {
    status: 'success',
    review,
    message: `Review updated with id: ${id}`,
  };
};

const deleteReviewById = async (id) => {
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    throw new apiError.APIErrorClass(404, `No review with id:${id} found`);
  }
};

module.exports = {
  getAllReviews,
  addReview,
  updateReviewById,
  deleteReviewById,
};
