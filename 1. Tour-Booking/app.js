const express = require('express'); // for creating web server
const morgan = require('morgan'); // logging middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express(); // initialize application
const routes = require('./routes');

const config = require('./config/config');

// GLOBAL MIDDLEWARES

app.use(helmet()); // setting HTTP security headers

if (config.node_env === 'development') {
  app.use(morgan('dev')); // development logging
}

// rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: parseInt(config.rate_limit_time_in_hrs, 10) * 60 * 1000,
  message: `100+ requests from this IP in ${parseInt(
    config.rate_limit_time_in_hrs,
    10,
  )} hr, please try again in an hour!`,
});
app.use('/', limiter);

// parse json request body (reading data from req.body with max size of 10kb)
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL Query Injection
// eg. login by just password => email: {'$gt': ""} (always true query)
app.use(mongoSanitize()); // looks at req body, query string & params and removes all 'dollar or dot' signs

// Data sanitization against Cross-site Scripting Attacks (XSS)
app.use(xss()); // cleans user i/p from malacious HTML code

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'rating.count',
      'rating.average',
      'maxGroupSize',
      'difficulty',
      'charges.price',
    ],
  }),
);

// serving static files
app.use(express.static(`${__dirname}/public`));

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// localhost:3000/
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'wellcome to toor booking api',
    app: 'Tour Booking Web App',
  });
});

app.use('/', routes);

module.exports = app;
