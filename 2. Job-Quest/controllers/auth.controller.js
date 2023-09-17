import { User } from "../models/users.model.js";
import { StatusCodes } from "http-status-codes";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customError.js";
import { createJWT } from "../utils/tokenUtils.js";
import { jwt_expiration_minutes } from "../config/config.js";

const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  req.body.password = await hashPassword(req.body.password);

  const user = await User.create(req.body);
  return res.status(StatusCodes.CREATED).json({ user, msg: "user created" });
};

const logIn = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  if (!isValidUser) throw new UnauthenticatedError("invalid credentials");

  const token = createJWT({ userId: user._id, role: user.role });

  res.cookie("jwt_cookie", token, {
    httpOnly: true,
    expires: new Date(Date.now() + jwt_expiration_minutes * 60 * 1000),
    // secure: process.env.NODE_ENV === 'production',
  });

  return res.status(200).json({ user, token, msg: "successfully logged In" });
};

const logOut = async (req, res) => {
  res.cookie("jwt_cookie", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res.status(StatusCodes.OK).json({ msg: "user loged-out" });
};

export { register, logIn, logOut };
