/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from "react";

import axios from "axios";

export default ({ postId }) => {
  const [comment, setComment] = useState("");

  const updateComment = (event) => {
    setComment(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
    //   comment,
    // });
    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      comment,
    });

    setComment("");
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group" style={{ marginBottom: "10px" }}>
          <label>New Comment</label>
          <input
            className="form-control"
            value={comment}
            onChange={updateComment}
          ></input>
        </div>
        <button className="btn btn-primary" style={{ marginBottom: "4px" }}>
          Add Comment
        </button>
      </form>
    </div>
  );
};
