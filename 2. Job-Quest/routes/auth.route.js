import express from "express";
import { register, logIn, logOut } from "../controllers/auth.controller.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middlewares/validation.middleware.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.route("/register").post(validateRegisterInput, register);
authRouter.route("/login").post(validateLoginInput, logIn);
authRouter.route("/logout").get(authenticateUser, logOut);

export { authRouter };
