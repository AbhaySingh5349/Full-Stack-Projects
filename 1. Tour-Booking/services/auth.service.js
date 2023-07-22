const { User } = require('../models');
const apiError = require('../helpers/apiErrors');

const userService = require('./user.service');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new apiError.APIErrorClass(
      409,
      `Email: ${userBody.email} Already Taken`,
    );
  }

  if (!(await User.isStrongPassword(userBody.password))) {
    throw new apiError.APIErrorClass(
      400,
      'password must contain at least one digit, alphabet and special character',
    );
  }

  // const user = await User.create(userBody); (in this way user may manually set role as admin)

  // we only allow data that we actually need to be put into new user, even if user tries to manually i/p a role, we will not store that
  const user = await User.create({
    name: userBody.name,
    email: userBody.email,
    role: userBody.role,
    password: userBody.password,
    passwordConfirm: userBody.passwordConfirm,
    photo: userBody.photo,
    passwordChangedTimestamp: userBody.passwordChangedTimestamp,
  });

  return {
    user,
    message: 'User Registered Successfully!',
  };
};

const loginUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) {
    throw new apiError.APIErrorClass(400, 'Enter both email and password');
  }

  const user = await userService.getUserByEmail(email);

  if (!(await user.isPasswordMatch(password))) {
    throw new apiError.APIErrorClass(400, 'Incorrect password!');
  }

  return {
    user,
    message: 'User logged in successfully!',
  };
};

module.exports = {
  createUser,
  loginUserWithEmailAndPassword,
};
