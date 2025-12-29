import { env } from "./config/env.js";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/googleAuth.js";
import "./config/facebookAuth.js";
import "./config/githubAuth.js";

import tasksRouter from "./routes/api/tasks.js";
import authRouter from "./routes/api/auth.js";
import usersRouter from "./routes/api/users.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: env.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// DEV
app.get("/api", async (req, res) => {
  res.send(
    "<div> <a href='/api/auth/google'>Google auth</a> <a href='/api/auth/facebook'>Facebook auth</a> <a href='/api/auth/github'>GitHub auth</a></div> "
  );
});

app.get("/api/google", (req, res) => {
  res.json({
    message: "Google auth success",
    token: req.query.token,
  });
});
app.get("/api/github", (req, res) => {
  res.json({
    message: "GitHub auth success",
    token: req.query.token,
  });
});

app.get("/api/facebook", (req, res) => {
  res.json({
    message: "Facebook auth success",
    token: req.query.token,
  });
});
//

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
