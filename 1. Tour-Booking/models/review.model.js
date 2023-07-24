const mongoose = require('mongoose');

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

// QUERY MIDDLEWARE (this object points to query)
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

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };
