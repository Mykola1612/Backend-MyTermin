import mongoose from "mongoose";
import { app } from "./app.js";

const { DB_HOST } = process.env;
mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000);
    return console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
