const { authService, tokenService } = require('../services');
const catchAsync = require('../helpers/catchAsync');

// cookie is small piece of text that server can send to client/
// when client receives cookie, automatically stores it & send it back along with all future requests to server where it came from

const register = catchAsync(async (req, res) => {
  const userObj = await authService.createUser(req.body);
  const authObj = await tokenService.generateAuthTokens(userObj.user);

  res.cookie('jwt_access_cookie', authObj.access.cookieOptions);

  return res.status(201).send({ userObj, authObj });
});

const login = catchAsync(async (req, res) => {
  const userObj = await authService.loginUserWithEmailAndPassword(
    req.body.email,
    req.body.password,
  );
  const authObj = await tokenService.generateAuthTokens(userObj.user);

  return res.status(200).send({ userObj, authObj });
});

module.exports = {
  register,
  login,
};
