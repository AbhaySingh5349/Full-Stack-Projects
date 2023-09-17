import express from "express";
import {
  addJob,
  deleteJobById,
  getAllJobs,
  getJobById,
  updateJobById,
} from "../controllers/jobs.controller.js";

import {
  validateIdParam,
  validateJobInput,
} from "../middlewares/validation.middleware.js";

const jobsRouter = express.Router();

jobsRouter.route("/").get(getAllJobs).post(validateJobInput, addJob);

jobsRouter
  .route("/:id")
  .get(validateIdParam, getJobById)
  .patch(validateJobInput, validateIdParam, updateJobById)
  .delete(validateIdParam, deleteJobById);

export { jobsRouter };
