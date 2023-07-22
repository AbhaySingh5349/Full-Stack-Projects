const mongoose = require('mongoose');
const slugify = require('slugify'); // to generate human-readable and search engine-friendly URLs

const tourSchema = mongoose.Schema(
  {
    // schema definition
    name: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a name'],
      unique: true,
      minlength: [2, 'minimum 2 characters required in tour name'],
      maxlength: [30, 'number of characters in tour name exceeding 30'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    rating: {
      average: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
        required: [true, 'A tour must have a rating'],
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    charges: {
      price: {
        type: Number,
        trim: true,
        required: [true, 'tour price not provided '],
      },
      discount: {
        type: Number,
        validate: {
          validator: function (val) {
            // this only points to current doc on new document creation and not for update
            return val < this.charges.price;
          },
          message: 'Discount price {VALUE} should be below regular price',
        },
      },
    },
    description: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    // options
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// fileds which we can define on our schema but they will not be persisted in db (as they can be derived from one another)
// we used regular func as => func do not have its own 'this' keyword
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE (this object points to document)
// runs before .save() and .create() and not for update
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// runs after .save() and .create() and not for update
/*tourSchema.post('save', function (savedDocument, next) {
  console.log(savedDocument);
  next();
}); */

// QUERY MIDDLEWARE (this object points to query)
// runs before any 'find' query is executed
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); // hiding 'secret tour' from normal users
  next();
});

// AGGREGATION MIDDLEWARE (this object points to aggregation object)
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // hiding 'secret tour' in aggregation methods

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = { Tour };
