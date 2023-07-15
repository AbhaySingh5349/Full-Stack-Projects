const express = require('express'); // for creating web server
const app = express(); // initialize application

// localhost:3000/
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'wellcome to toor booking api',
    app: 'Tour Booking Web App',
  });
});

module.exports = app;
