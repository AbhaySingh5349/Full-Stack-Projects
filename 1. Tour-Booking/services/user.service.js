const { User } = require('../models');
const apiError = require('../helpers/apiErrors');
const utils = require('../helpers/utils');

const getAllUsers = async () => {
  const users = await User.find();
  if (!users) {
    throw new apiError.APIErrorClass(500, 'Failed to fetch users info');
  }

  return {
    users,
    message: 'User fetched successfully',
  };
};

const getUserByEmail = async (email) => {
  console.log('EMAIL: ', email);
  const user = await User.findOne({ email }).select('+password'); // since we need password with user object for validating against current i/p password
  if (!user) {
    throw new apiError.APIErrorClass(
      404,
      `User not found with email: ${email}`,
    );
  }

  return user;
};

const getUserById = async (id) => {
  const user = await User.findById({ _id: id }).select('+password');
  if (!user) {
    throw new apiError.APIErrorClass(404, `User not found with id: ${id}`);
  }

  return user;
};

const getUserByResetToken = async (token) => {
  // const user = await User.findOne({
  //   resetPasswordToken: token,
  //   resetPasswordExpiresTimestampTimestamp: { $gt: Date.now() },
  // });

  const user = await User.findOne({ resetPasswordToken: token });

  if (!user || user?.resetPasswordExpiresTimestamp.getTime() < Date.now()) {
    const msg = user
      ? `Token: ${token} expired, please reset password again`
      : `User not found with token: ${token}`;
    throw new apiError.APIErrorClass(404, msg);
  }

  return user;
};

const updateUserWithId = async (req, id) => {
  if (!req?.user) {
    throw new apiError.APIErrorClass(401, req?.authMessage ?? 'error');
  }

  const userBody = utils.fiteredObject(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(id, userBody, {
    new: true, // returns updated object
    runValidators: true,
  });
  if (!user) {
    throw new apiError.APIErrorClass(404, `No user with id:${id} found`);
  }

  return user;
};

const deactivateById = async (req, id) => {
  if (!req?.user) {
    throw new apiError.APIErrorClass(401, req?.authMessage ?? 'error');
  }

  await User.findByIdAndUpdate(
    id,
    { activeStatus: false },
    {
      new: true, // returns updated object
      runValidators: true,
    },
  );

  return;
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserByResetToken,
  updateUserWithId,
  deactivateById,
};
