import { env } from "./config/env.js";
import mongoose from "mongoose";
import { app } from "./app.js";

mongoose.set("strictQuery", true);

mongoose
  .connect(env.dbHost)
  .then(() => {
    app.listen(env.port);
    return console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
