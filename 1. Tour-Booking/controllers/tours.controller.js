const tourService = require('../services/tours.service');
const catchAsync = require('../helpers/catchAsync');
const apiError = require('../helpers/apiErrors');

const fetchAllTours = catchAsync(async (req, res) => {
  if (!req?.user) {
    throw new apiError.APIErrorClass(401, req?.authMessage ?? 'error');
  }

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

module.exports = {
  fetchAllTours,
  fetchTourWithId,
  updateTourWithId,
  deleteTourWithId,
  addTour,
  getTourStats,
  getMonthlyPlan,
};
