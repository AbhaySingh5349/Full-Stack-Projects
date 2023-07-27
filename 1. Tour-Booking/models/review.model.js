const mongoose = require('mongoose');
const { Tour } = require('../models');
// const tourService = require('../services/tours.service');

// In situations where we do not know how much 'Array' of particular field may grow, we should use 'Parent Referencing'
// Review belongs to a Tour & also needs an Author (Both tour & user are parents to Review)

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    // options: when we have virtual property(field not stored in db, but cal. using other value), we need to make them visible
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.statics.calcAvgRating = async function (tourId) {
  // 'this' points to model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        countRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  /* causing cyclic dependency issue */
  // await tourService.updateTourWithId(tourId, {
  //   'rating.average': stats[0].avgRating,
  //   'rating.count': stats[0].countRatings,
  // });

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      'rating.average': stats[0].avgRating,
      'rating.count': stats[0].countRatings,
    });
  } else {
    // when no reviews are added
    await Tour.findByIdAndUpdate(tourId, {
      'rating.average': 4.5,
      'rating.count': 0,
    });
  }
};

// DOCUMENT MIDDLEWARE
// calculating ratings after doc is saved
reviewSchema.post('save', function () {
  // this points to current review but we need to call the static func defined on model (Review.calcAvgRating(this.tour)) is not possible
  this.constructor.calcAvgRating(this.tour);
});

// QUERY MIDDLEWARE (this object points to query & we do not have direct access to doc)
// runs before any 'find' query is executed
reviewSchema.pre(/^find/, function (next) {
  // parent reference for tour & user in review schema
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// findByIdAndUpdate, findByIdAndDelete
reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAvgRating(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };
