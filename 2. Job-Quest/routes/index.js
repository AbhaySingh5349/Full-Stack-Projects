import express from "express";

import { authRouter } from "./auth.route.js";
import { userRouter } from "./users.route.js";
import { jobsRouter } from "./jobs.route.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", authenticateUser, userRouter);
router.use("/jobs", authenticateUser, jobsRouter);

export { router };
