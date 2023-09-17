import { Job } from "../models/jobs.model.js";
import StatusCodes from "http-status-codes";
import { NotFoundError } from "../errors/customError.js";

// import { nanoid } from "nanoid";

// let jobs = [
//   { id: nanoid(), company: "apple", role: "front-end" },
//   { id: nanoid(), company: "google", role: "back-end" },
//   { id: nanoid(), company: "Tesla", role: "dev ops" },
// ];

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  return res.status(StatusCodes.OK).json({ jobs });
};

const getJobById = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  return res.status(StatusCodes.OK).json({ job });
};

const updateJobById = async (req, res) => {
  // const { company, role } = req.body;
  // if (!company || !role) {
  //   return res.status(400).json({ message: "add all details about job" });
  // }

  const { id } = req.params;
  const job = await Job.findByIdAndUpdate(id, req.body, { new: true });
  return res.status(200).json({ message: "job updated", job });
};

const addJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const { company, role, createdBy } = req.body;
  if (!company || !role) {
    return res.status(400).json({ message: "add all details about job" });
  }

  const job = await Job.create({ company, role, createdBy });
  return res.status(201).json({ message: "job created successfully", job });
};

const deleteJobById = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByIdAndDelete(id);
  return res.status(200).json({ message: "job deleted successfully", job });
};

export { getAllJobs, getJobById, updateJobById, addJob, deleteJobById };
