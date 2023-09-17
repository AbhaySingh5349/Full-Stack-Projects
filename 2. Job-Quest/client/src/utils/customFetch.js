import axios from "axios";

const customFetch = axios.create({
  baseURL: "/app/v1",
});

export default customFetch;
