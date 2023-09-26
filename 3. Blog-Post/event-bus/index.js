const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  /*  axios
    .post("http://localhost:4000/events", event)
    .catch((err) => console.log("posts error: ", err.message)); // posts
  axios
    .post("http://localhost:4001/events", event)
    .catch((err) => console.log("comments error: ", err.message)); // comments
  axios
    .post("http://localhost:4002/events", event)
    .catch((err) => console.log("query service error: ", err.message)); // query service
  axios
    .post("http://localhost:4003/events", event)
    .catch((err) => console.log("moderation error: ", err.message)); // moderation service
*/

  axios
    .post("http://posts-clusterip-srv:4000/events", event)
    .catch((err) => console.log("posts error: ", err.message)); // posts

  axios
    .post("http://comments-clusterip-srv:4001/events", event)
    .catch((err) => console.log("comments error: ", err.message)); // comments

  axios
    .post("http://query-clusterip-srv:4002/events", event)
    .catch((err) => console.log("query service error: ", err.message)); // query service

  axios
    .post("http://moderation-clusterip-srv:4003/events", event)
    .catch((err) => console.log("moderation error: ", err.message)); // moderation service

  return res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  return res.send(events);
});

app.listen(4005, (req, res) => {
  console.log("listening for event bus at port 4005");
});

// kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
