const { Tour } = require('../models');
const catchAsync = require('../helpers/catchAsync');
const apiError = require('../helpers/apiErrors');

const renderBase = (req, res) => {
  return res.status(200).render('base', {
    title: 'Exciting tours for adventurous people',
  }); // it will go in 'views' folder & look for 'base template' then render it and send as response to server
};

const renderOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find({});
  return res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const renderTour = catchAsync(async (req, res) => {
  if (!req?.user) {
    throw new apiError.APIErrorClass(401, req?.authMessage ?? 'error');
  }

  const slug = req.params.tourSlug;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    throw new apiError.APIErrorClass(404, `No Tour found with name ${slug}`);
  }

  return res
    .status(200)
    .set(
      'Content-Security-Policy',
      'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com',
    )
    .render('tour', {
      title: tour.name,
      tour,
    });
});

const getLoginForm = catchAsync(async (req, res) => {
  return res.status(200).render('login', {
    title: 'Log Into Account',
  });
});

module.exports = {
  renderBase,
  renderOverview,
  renderTour,
  getLoginForm,
};
