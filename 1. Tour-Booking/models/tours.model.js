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
    startLocation: {
      // GeoJSON (to represent Geospatial data)
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    // embedding all locations document in Tour document
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number, // day of tour on which people will go to this location
      },
    ],
    guides: [
      // Child referencing
      // tours & users will be separated entities, we just need to have reference to id's of guides for that specific tour
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    // options: when we have virtual property(field not stored in db, but cal. using other value), we need to make them visible
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ duration: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// fieLds which we can define on our schema but they will not be persisted in db (as they can be derived from one another)
// we used regular func as => func do not have its own 'this' keyword
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate (keeping array of 'review ids' like in child referencing but without actually persisting to db)
tourSchema.virtual('reviews', {
  // populate this field in controller, since we only need for particular 'id' & not for all find operations
  ref: 'Review',
  foreignField: 'tour', // field name of schema in child model
  localField: '_id', // property by which we are accessing schema in child model
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

  // child reference for guides in Tour schema
  this.populate({
    path: 'guides',
    select: '-passwordChangedTimestamp -createdAt -__v',
  });

  next();
});

// AGGREGATION MIDDLEWARE (this object points to aggregation object)
tourSchema.pre('aggregate', function (next) {
  // to avoid: $geoNear was not the first stage in the pipeline after optimization

  /*  if (!(this.pipeline().length > 0 && '$geoNear' in this.pipeline()[0])) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // hiding 'secret tour' in aggregation methods
  } */

  if (
    !Object.values(this.pipeline()).some((stage) =>
      String(Object.keys(stage) === '$geoNear'),
    )
  ) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // hiding 'secret tour' in aggregation methods
  }

  console.log('aggregation pipeline: ', this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = { Tour };
