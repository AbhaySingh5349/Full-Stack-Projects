const catchAsync = require('../helpers/catchAsync');
const { tokenService, userService } = require('../services');
const sendEmail = require('../helpers/email');
const utils = require('../helpers/utils');
const config = require('../config/config');
const crypto = require('crypto');
const apiError = require('../helpers/apiErrors');

const getAllUsers = catchAsync(async (req, res) => {
  const usersObj = await userService.getAllUsers();

  return res.status(201).send(usersObj);
});

const getMyInfo = catchAsync(async (req, res) => {
  const userObj = await userService.getUserById(req.user._id);

  return res.status(201).send(userObj);
});

const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body?.email);
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL =
    utils.generateBaseURL(req) + '/users/resetPassword/' + `${resetToken}`;

  const emailMessage = `Forgot your password ? reset it through: ${resetURL}.\nelse ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password reset token, valid for ${config.reset_token_expiration_minutes} minutes`,
      message: emailMessage,
    });
    return res.status(200).send({ user, resetToken });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });
  }
});

const resetPassword = catchAsync(async (req, res) => {
  // get user based on reset token
  const cryptoToken = crypto
    .createHash('sha256')
    .update(req.params?.resetToken ?? '')
    .digest('hex');

  const user = await userService.getUserByResetToken(cryptoToken);

  console.log('user found: ', user);

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // user.passwordChangedTimestamp = Date.now(); but its better to let it happen behind the scenes by Data Middleware

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  // login user again
  const authObj = await tokenService.generateAuthTokens(user);

  return res.status(200).send({ user, authObj });
});

const updatePassword = catchAsync(async (req, res) => {
  if (!req?.user) {
    throw new apiError.APIErrorClass(401, req?.authMessage ?? 'error');
  }
  const user = await userService.getUserById(req.user._id);

  console.log('user found: ', user);

  if (!(await user.isPasswordMatch(req.body.oldPassword))) {
    throw new apiError.APIErrorClass(401, 'Incorrect password!');
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // login user again
  const authObj = await tokenService.generateAuthTokens(user);

  return res
    .status(200)
    .send({ user, authObj, message: 'Password Updated Successfully' });
});

const updateData = catchAsync(async (req, res) => {
  const user = await userService.updateUserWithId(req, req.user._id);

  return res.status(200).send(user);
});

const deactivateAccount = catchAsync(async (req, res) => {
  await userService.deactivateById(req, req.user._id);

  return res.status(204).send('Account deactivated successfully');
});

module.exports = {
  getAllUsers,
  getMyInfo,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateData,
  deactivateAccount,
};
