import mongoose from "mongoose";
import { db_url, db_password } from "./config.js";

const MONGOOSE_URL = db_url.replace("<PASSWORD>", db_password);

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGOOSE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export { connectToMongoDB };
