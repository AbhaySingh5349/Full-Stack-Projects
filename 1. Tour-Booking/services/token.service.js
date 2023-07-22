const jwt = require('jsonwebtoken');
const config = require('../config/config');
const tokenTypes = require('../config/tokens');

const generateToken = (userId, expires, type) => {
  const payload = {
    sub: userId,
    type,
    iat: Math.floor(Date.now() / 1000),
    exp: expires,
  };

  return jwt.sign(payload, config.jwt.secret);
};

const generateAuthTokens = async (user) => {
  // expiration timestamp (in seconds) is 60 minutes after it is generated
  const tokenExpires =
    Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
  const jwtToken = generateToken(user._id, tokenExpires, tokenTypes.ACCESS);

  const cookieOptions = {
    issuedAt: new Date(Date.now()),
    expires: new Date(
      Date.now() +
        parseInt(config.jwt.accessCookieExpirationDays, 10) *
          24 *
          60 *
          60 *
          1000,
    ), // browser or client will delete cookie once it expires
    secure: false, // cookie will only be sent on an encrypted connection
    httpOnly: true, // cookie cannot be modified by browser (prevent Cross Site Scripting Attack)
  };

  if (config.node_env === 'production') cookieOptions.secure = true;

  user.password = undefined; // not exposing users password

  return {
    access: {
      token: {
        value: jwtToken,
        issuedAt: new Date(Date.now()),
        expires: new Date(tokenExpires * 1000),
      },
      cookieOptions,
    },
  };
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
