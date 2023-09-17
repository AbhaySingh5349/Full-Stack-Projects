import "express-async-errors";
import express from "express"; // for creating web server
import morgan from "morgan";

import cookieParser from "cookie-parser";
import cors from "cors";

// config
import { node_env } from "./config/config.js";

// router
import { router } from "./routes/index.js";

// middleware
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express(); // initialize application

if (node_env === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// parse json request body (reading data from req.body with max size of 10kb)
app.use(express.json({ limit: "10kb" }));

// localhost:3000/
app.get("/app", (req, res) => {
  res.status(200).json({
    message: "wellcome to job quest api",
    app: "Job Quest Web App",
  });
});

app.use("/app/v1", router);

// not found middleware (for non-existent routes)
app.use("*", (req, res) => {
  return res.status(404).send({ message: "route/resource not found" });
});

// error middleware (handles unexpected errors that occur while processing requests)
app.use(errorMiddleware);

export { app };
