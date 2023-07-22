/* eslint-disable no-console */
const { Tour } = require('../../models');
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

const toursData = JSON.parse(
  utils.readFileSync(`${__dirname}/tours-simple.json`),
);

const importDataToDB = async () => {
  try {
    await Tour.create(toursData);
    console.log('imported tours data to db');
  } catch (err) {
    console.log('error in importing tours data to db: ', err);
  }
  process.exit();
};

const deleteDataFromCollection = async () => {
  try {
    await Tour.deleteMany();
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
