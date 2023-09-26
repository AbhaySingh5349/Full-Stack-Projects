const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { randomBytes } = require("crypto");
const app = express();

app.use(express.json());
app.use(cors());

let commentsByPostId = {};

app.get("/", (req, res) => {
  return res.status(200).send("Blog comments");
});

app.get("/posts/:id/comments", (req, res) => {
  const post_id = req.params.id;
  const comments = commentsByPostId[post_id] || [];
  return res.send(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { comment } = req.body;
  const post_id = req.params.id;

  const comments = commentsByPostId[post_id] || [];
  comments.push({ id, comment, status: "pending" });
  commentsByPostId[post_id] = comments;

  /*  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: { id, comment, post_id, status: "pending" },
  });
  */

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: { id, comment, post_id, status: "pending" },
  });

  return res.send({ id, comment });
});

// receive requests from event-bus
app.post("/events", async (req, res) => {
  console.log("received comment event: ", req.body);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { id, post_id, status, comment } = data;
    const comments = commentsByPostId[post_id];

    const old_comment = comments.find((comment) => {
      return comment.id === id;
    });

    old_comment.status = status;

    /*  await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: { id, comment, post_id, status },
    }); */

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      data: { id, comment, post_id, status },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("listening for comments at port 4001");
});
