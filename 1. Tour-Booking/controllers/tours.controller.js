const tourService = require('../services/tours.service');
const catchAsync = require('../helpers/catchAsync');
const apiError = require('../helpers/apiErrors');
const { Tour } = require('../models');

const fetchAllTours = catchAsync(async (req, res) => {
  console.log('req.query: ', req.query);
  const toursObj = await tourService.fetchAllTours(req);

  if (toursObj.tours) {
    res.status(200);
  } else {
    res.status(404);
  }

  return res.send(toursObj);
});

const fetchTourWithId = catchAsync(async (req, res) => {
  const tourObj = await tourService.fetchTourById(String(req.params.tourId));

  return res.status(200).send(tourObj);
});

const updateTourWithId = catchAsync(async (req, res) => {
  const tourObj = await tourService.updateTourWithId(
    String(req.params.tourId),
    req.body,
  );

  return res.status(200).send(tourObj);
});

const deleteTourWithId = catchAsync(async (req, res) => {
  if (!req?.user || !req.user?.isAuthorized) {
    throw new apiError.APIErrorClass(
      req?.statusCode ? req.statusCode : 401,
      req?.authMessage ?? 'error',
    );
  }

  await tourService.deleteTourWithId(String(req.params.tourId));

  return res.status(204).send({});
});

const addTour = catchAsync(async (req, res) => {
  if (!req?.user || !req.user?.isAuthorized) {
    throw new apiError.APIErrorClass(
      req?.statusCode ? req.statusCode : 401,
      req?.authMessage ?? 'error',
    );
  }

  const tourObj = await tourService.addTour(req.body);

  return res.send(tourObj);
});

const getTourStats = catchAsync(async (req, res) => {
  const statsObj = await tourService.getTourStats();

  return res.status(200).send(statsObj);
});

const getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const planObj = await tourService.getMonthlyPlan(year);

  return res.status(200).send(planObj);
});

const getToursWithinRadius = catchAsync(async (req, res) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    throw new apiError.APIErrorClass(
      400,
      'Please provide your current location in format: lat,lng',
    );
  }

  console.log('{ distance, latlng, unit }: ', { distance, latlng, unit });

  const toursObj = await tourService.getToursWithinRadius(
    distance,
    lat,
    lng,
    unit,
  );

  return res.status(200).send(toursObj);
});

const getDistancesOfAllToursFromPoint = catchAsync(async (req, res) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    throw new apiError.APIErrorClass(
      400,
      'Please provide location in format: lat,lng',
    );
  }

  const statsObj = await tourService.getDistancesOfAllToursFromPoint(
    lat,
    lng,
    unit,
  );

  return res.status(200).send(statsObj);
});

module.exports = {
  fetchAllTours,
  fetchTourWithId,
  updateTourWithId,
  deleteTourWithId,
  addTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithinRadius,
  getDistancesOfAllToursFromPoint,
};
