import * as dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;
const node_env = process.env.NODE_ENV;
const db_url = process.env.DATABASE;
const db_password = process.env.DATABASE_PASSWORD;
const jwt_secret = process.env.JWT_SECRET;
const jwt_expiration_minutes = process.env.JWT_ACCESS_EXPIRATION_MINUTES;

export {
  port,
  node_env,
  db_url,
  db_password,
  jwt_secret,
  jwt_expiration_minutes,
};
