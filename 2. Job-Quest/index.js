import { app } from "./app.js";
import { port } from "./config/config.js";
import { connectToMongoDB } from "./config/mongodb.js";

// // opening a socket connection on machine stating that anything coming from outside on PORT 3000 will hit this application
app.listen(port, async (err) => {
  if (!err) {
    console.log(`Server successfully started on port: ${port}`);
    await connectToMongoDB();
  } else {
    console.log("Failed to start server");
  }
});
