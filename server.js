import mongoose from "mongoose";
import app from "./app.js";

const DB_HOST =
  "mongodb+srv://Mykola:b30HFkHdVkHaIUVT@cluster0.v2e3tim.mongodb.net/db-mytermin?appName=Cluster0";
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
