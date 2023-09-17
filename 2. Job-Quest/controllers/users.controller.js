import { User } from "../models/users.model.js";
import { Job } from "../models/jobs.model.js";
import { StatusCodes } from "http-status-codes";

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  return res.status(StatusCodes.OK).json({ user: user.hidePassword() });
};

const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;
  delete newUser.role;

  /*  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ msg: "update user" }); */

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser, {
    new: true,
  });

  return res.status(StatusCodes.OK).json(updatedUser);
};

const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};

export { getCurrentUser, updateUser, getApplicationStats };
