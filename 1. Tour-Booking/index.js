/* eslint-disable no-console */
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');

// Uncaught exceptions (bugs in synchronous code that are not handled eg. logging undefined variables)
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED! 💥 Shutting down...');
  process.exit(1); // to shut down application
});

const MONGOOSE_PASSWORD = config.db_password;
const MONGOOSE_URL = config.db_url.replace('<PASSWORD>', MONGOOSE_PASSWORD);

mongoose
  .connect(MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('db is connected');
  });
// .catch((err) => {
//   console.log('error connecting db: ', err);
// });

const PORT = config.port;

// opening a socket connection on machine stating that anything coming from outside on PORT 3000 will hit this application
const server = app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server successfully started on port: ${PORT}`);
  } else {
    console.log('Failed to start server');
  }
});

// Unhandled Promise Rejections (if we forgot to add catch blocks for promises)
// 'process' object emits an object 'unhandledRejection', so we need to subscribe to that event
// process.on('unhandledRejection', (err) => {
//   console.log(
//     'UNHANDLED REJECTION! 💥 Shutting down...',
//     err.name,
//     err.message,
//   );
//   // giving server time to finish requests which are being handled & not abruptly ending program
//   server.close(() => {
//     process.exit(1); // to shut down application
//   });
// });
