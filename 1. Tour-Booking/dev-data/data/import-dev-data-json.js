/* eslint-disable no-console */
const { User, Tour, Review } = require('../../models');
const mongoose = require('mongoose');

const utils = require('../../helpers/utils');
const config = require('../../config/config');

const MONGOOSE_PASSWORD = config.db_password;
const MONGOOSE_URL = config.db_url.replace('<PASSWORD>', MONGOOSE_PASSWORD);

mongoose
  .connect(MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('db is connected');
  })
  .catch((err) => {
    console.log('error connecting db: ', err);
  });

const usersData = JSON.parse(utils.readFileSync(`${__dirname}/users.json`));

const toursData = JSON.parse(
  utils.readFileSync(`${__dirname}/tours-simple.json`),
);

const reviewsData = JSON.parse(utils.readFileSync(`${__dirname}/reviews.json`));

const importDataToDB = async () => {
  try {
    await User.create(usersData, { validateBeforeSave: false });
    await Tour.create(toursData);
    await Review.create(reviewsData);
    console.log('imported tours data to db');
  } catch (err) {
    console.log('error in importing tours data to db: ', err);
  }
  process.exit();
};

const deleteDataFromCollection = async () => {
  try {
    await User.deleteMany();
    await Tour.deleteMany();
    await Review.deleteMany();
    console.log('data deleted');
  } catch (err) {
    console.log('error in deleting data: ', err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importDataToDB();
} else if (process.argv[2] === '--delete') {
  deleteDataFromCollection();
}
console.log('process.argv: ', process.argv);
