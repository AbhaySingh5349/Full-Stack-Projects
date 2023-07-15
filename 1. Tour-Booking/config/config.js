const dotenv = require('dotenv'); // loads environment variables from .env file
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  port: process.env.PORT,
};
