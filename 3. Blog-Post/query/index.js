const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, comment, post_id, status } = data;
    const post = posts[post_id];
    post.comments.push({ id, comment, post_id, status });
  }

  if (type === "CommentUpdated") {
    const { id, comment, post_id, status } = data;

    const post = posts[post_id];
    console.log("post: ", post);
    const old_comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    console.log("post_id: ", post_id, " , id: ", id);
    console.log("old_comment: ", old_comment);

    old_comment.status = status;
    old_comment.comment = comment;
  }
};

app.get("/posts", (req, res) => {
  return res.status(200).send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  console.log("posts from query service: ", posts);

  return res.send({});
});

app.listen(4002, async () => {
  console.log("listening for query at port 4002");

  try {
    // const res = await axios.get("http://localhost:4005/events");
    const res = await axios.get("http://event-bus-srv:4005/events");

    for (let event of res.data) {
      console.log("Processing event: ", event.type);
      handleEvent(event.type, event.data);
    }
  } catch (err) {
    console.log("query server listen error: ", err.message);
  }
});
