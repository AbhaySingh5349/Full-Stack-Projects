const fs = require('fs');
const config = require('../config/config');

function readFileSync(filePath) {
  const data = fs.readFileSync(filePath, { encoding: 'utf-8', flag: 'r' });

  return data;
}

const generateBaseURL = (req) => {
  const protocol = req.protocol;
  const host = req.hostname;
  const port = config.port;

  return `${protocol}://${host}:${port}`;
};

const generateURL = (req) => {
  const url = req.originalUrl;

  return generateBaseURL + `${url}`;
};

const fiteredObject = (obj, ...allowedFeilds) => {
  const newObj = {};
  Object.keys(obj).forEach((field) => {
    if (allowedFeilds.includes(field)) newObj[field] = obj[field];
  });

  return newObj;
};

module.exports = {
  readFileSync,
  generateBaseURL,
  generateURL,
  fiteredObject,
};
