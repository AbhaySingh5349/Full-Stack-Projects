import jwt from "jsonwebtoken";
import { jwt_secret, jwt_expiration_minutes } from "../config/config.js";

const createJWT = (payload) => {
  const token = jwt.sign(payload, jwt_secret, {
    expiresIn: jwt_expiration_minutes * 60,
  });
  return token;
};

const verifyJWT = (token) => {
  const decoded = jwt.verify(token, jwt_secret);
  return decoded;
};

export { createJWT, verifyJWT };
