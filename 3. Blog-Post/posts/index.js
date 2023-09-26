const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { randomBytes } = require("crypto");
const app = express();

app.use(express.json());
app.use(cors());

let posts = {};

app.get("/", (req, res) => {
  return res.status(200).send("Blog Posts");
});

app.get("/posts", (req, res) => {
  return res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  // await axios.post("http://localhost:4005/events", {
  //   type: "PostCreated",
  //   data: posts[id],
  // });

  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: posts[id],
  });

  return res.status(201).send(posts[id]);
});

// receive requests from event-bus
app.post("/events", (req, res) => {
  console.log("received post event: ", req.body);

  res.send({});
});

app.listen(4000, () => {
  console.log("posts version with skaffold");
  console.log("listening for posts at port 4000");
});
