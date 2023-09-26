const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// receive requests from event-bus
app.post("/events", async (req, res) => {
  console.log("received moderation event: ", req.body);

  const { type, data } = req.body;
  if (type == "CommentCreated") {
    const status = data.comment.includes("orange") ? "rejected" : "approved";

    /*  await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        post_id: data.post_id,
        status,
        comment: data.comment,
      },
    }); */

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        post_id: data.post_id,
        status,
        comment: data.comment,
      },
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("listening for moderation at port 4003");
});
