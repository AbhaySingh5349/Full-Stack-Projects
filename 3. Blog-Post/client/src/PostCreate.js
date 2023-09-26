/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from "react";
import axios from "axios";

export default () => {
  const [title, setTitle] = useState("");

  const updateTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // await axios.post("http://posts.com:4000/posts", { title });
    await axios.post("http://posts.com/posts/create", { title });

    setTitle("");
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group" style={{ marginBottom: "10px" }}>
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={updateTitle}
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
