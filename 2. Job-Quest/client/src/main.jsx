import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

// import customFetch from "./utils/customFetch.js";

// const data = await customFetch.get("/");
// console.log("data: ", data);

// fetch("/app")
//   .then((res) => res.json())
//   .then((data) => console.log("data: ", data));

import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <ToastContainer position="top-center" />
  </React.StrictMode>
);
