import express from "express";
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from "../controllers/users.controller.js";
import { authorizePermissions } from "../middlewares/auth.middleware.js";
import { validateUpdateUserInput } from "../middlewares/validation.middleware.js";

const userRouter = express.Router();

userRouter
  .route("/current-user")
  .get(getCurrentUser)
  .patch(validateUpdateUserInput, updateUser);

userRouter
  .route("/admin/app-stats")
  .get(authorizePermissions("admin"), getApplicationStats);

export { userRouter };
