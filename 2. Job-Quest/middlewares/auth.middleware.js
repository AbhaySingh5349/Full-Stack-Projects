import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from "../errors/customError.js";

import { verifyJWT } from "../utils/tokenUtils.js";

const authenticateUser = (req, res, next) => {
  const { jwt_cookie } = req.cookies;
  if (!jwt_cookie)
    throw new UnauthenticatedError("authentication failed, please login first");

  try {
    const { userId, role } = verifyJWT(jwt_cookie);
    // const testUser = userId === "64b2c07ccac2efc972ab0eca";
    req.user = { userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication failed, please login first");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Demo User. Read Only!");
  next();
};

export { authenticateUser, authorizePermissions, checkForTestUser };
