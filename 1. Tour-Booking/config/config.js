const dotenv = require('dotenv'); // loads environment variables from .env file
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  db_password: process.env.DATABASE_PASSWORD,
  db_url: process.env.DATABASE,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    accessCookieExpirationDays: process.env.JWT_ACCESS_COOKIE_EXPIRATION_DAYS,
  },
  reset_token_expiration_minutes:
    process.env.RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES,
  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  email_id: process.env.EMAIL_ID,
  email_password: process.env.EMAIL_PASSWORD,
  rate_limit_time_in_hrs: process.env.RATE_LIMITER_TIME_IN_HOURS,
};
