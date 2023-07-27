const { Tour } = require('../models');
const apiFeaturesClass = require('../helpers/apiFeatures');
const apiError = require('../helpers/apiErrors');

const addTour = async (tourBody) => {
  const tour = await Tour.create(tourBody);

  return {
    status: 'success',
    tour,
    message: 'Tour Added Successfully!',
  };
};

// http://localhost:3000/tours?duration[gte]=5&difficulty=easy&charges.price[lt]=1500&sort=charges.price
// http://localhost:3000/tours?sort=charges.price,-rating.average,-rating.count
// http://localhost:3000/tours?fields=name+duration+difficulty+price
// http://localhost:3000/tours?page=1&limit=2
// http://localhost:3000/tours?sort=-rating.average,charges.price&limit=5 (top 5 places)

const fetchAllTours = async (req) => {
  // const tours = await Tour.find(queryObj); returns final documents
  // const query = Tour.find(queryObj); returns query upon which we can further operate

  try {
    const features = new apiFeaturesClass.APIFeatures(Tour, req.query)
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    return {
      status: 'success',
      tours,
      message: 'Tours Fetched Successfully!',
    };
  } catch (err) {
    return {
      status: 'failure',
      tours: null,
      message: err,
    };
  }
};

const fetchTourById = async (id) => {
  const tour = await Tour.findById(id).populate({
    path: 'reviews',
    select: 'review',
  });

  if (!tour) {
    throw new apiError.APIErrorClass(404, `No tour with id:${id} found`);
  }
  return {
    status: 'success',
    tour,
    message: `Tour found with id: ${id}`,
  };
};

const updateTourWithId = async (id, tourBody) => {
  const tour = await Tour.findByIdAndUpdate(id, tourBody, {
    new: true, // returns updated object
    runValidators: true,
  });
  if (!tour) {
    throw new apiError.APIErrorClass(404, `No tour with id:${id} found`);
  }
  return {
    status: 'success',
    tour,
    message: `Tour updated with id: ${id}`,
  };
};

const deleteTourWithId = async (id) => {
  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) {
    throw new apiError.APIErrorClass(404, `No tour with id:${id} found`);
  }
};

const getTourStats = async () => {
  const stats = await Tour.aggregate([
    {
      $match: { 'rating.average': { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$rating.average',
        countTours: { $sum: 1 },
        countRatings: { $sum: '$rating.count' },
        avgRating: { $avg: '$rating.average' },
        avgPrice: { $avg: '$charges.price' },
        minPrice: { $min: '$charges.price' },
        maxPrice: { $max: '$charges.price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // ascending sort
    },
    {
      $match: { _id: { $ne: 4.7 } },
    },
  ]);

  if (!stats) {
    throw new apiError.APIErrorClass(404, `Failed to get stats`);
  }

  return {
    status: 'success',
    stats,
    message: 'Aggregated stats',
  };
};

const getMonthlyPlan = async (year) => {
  const plan = await Tour.aggregate([
    {
      // desconstruct array field from i/p docs & o/p new doc for each element of array
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        countTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0, // don't show id field in aggregation
      },
    },
    {
      $sort: { countTours: -1 }, // descending sort
    },
    {
      $limit: 12,
    },
  ]);

  if (!plan) {
    throw new apiError.APIErrorClass(404, `Failed to get monthly plan`);
  }

  return {
    status: 'success',
    plan,
    message: 'Monthly Plan',
  };
};

// it is important to index GeoSpatial queries
const getToursWithinRadius = async (distance, lat, lng, unit) => {
  const radius = unit === 'miles' ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  if (!tours) {
    throw new apiError.APIErrorClass(
      404,
      `No Tours within ${distance} ${unit} from center ${lat},${lng}`,
    );
  }
  return {
    status: 'success',
    tours,
    message: `Tours within ${distance} ${unit} from center ${lat},${lng}`,
  };
};

const getDistancesOfAllToursFromPoint = async (lat, lng, unit) => {
  // as distance is calculated in meters, so converting distances in specified unit
  const multiplier = unit === 'miles' ? 0.000621371 : 0.001;

  // uses geo-spatial index for aggregation
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance', // field where all calculated distances will be stored
        distanceMultiplier: multiplier,
      },
    },
    {
      // limit number of fields in response
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  if (!distances) {
    throw new apiError.APIErrorClass(
      404,
      `Failed to get distances of locations from center ${lat},${lng}`,
    );
  }

  return {
    status: 'success',
    distances,
    message: 'Calculated distances',
  };
};

module.exports = {
  addTour,
  fetchAllTours,
  fetchTourById,
  updateTourWithId,
  deleteTourWithId,
  getTourStats,
  getMonthlyPlan,
  getToursWithinRadius,
  getDistancesOfAllToursFromPoint,
};
