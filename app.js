import { env } from "./config/env.js";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import "./config/googleAuth.js";
import "./config/facebookAuth.js";
import "./config/githubAuth.js";

import tasksRouter from "./routes/api/tasks.js";
import authRouter from "./routes/api/auth.js";
import usersRouter from "./routes/api/users.js";

export const app = express();

app.use(cookieParser());
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
app.get("/", async (req, res) => {
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

// privacy
app.get("/privacy", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Privacy Policy</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; line-height: 1.6; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>Privacy Policy</h1>
      <p>This is the privacy policy of <strong>My Termin</strong> application.</p>
      <p>We respect your privacy and ensure your data is safe.</p>
      <p>For more information, contact us at: <a href="mailto:fermer2007pavlovich@gmail.com">fermer2007pavlovich@gmail.com</a></p>
    </body>
    </html>
  `);
});

app.get("/delete-data", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Удаление данных</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; line-height: 1.6; background: #f5f5f5; }
        h1 { color: #333; }
        button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
        .container { max-width: 600px; margin: auto; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        p { margin-bottom: 1rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Удаление данных пользователя</h1>
        <p>Вы можете удалить все свои данные из нашего приложения. После этого ваши данные будут безвозвратно удалены из нашей базы данных.</p>
        <p>Для удаления данных нажмите кнопку ниже. Вам потребуется ввести пароль для подтверждения.</p>
        <button id="deleteBtn">Удалить мои данные</button>
        <p id="response" style="color: green; margin-top: 1rem;"></p>
      </div>

      <script>
        const button = document.getElementById("deleteBtn");
        const response = document.getElementById("response");

        button.addEventListener("click", async () => {
          const password = prompt("Введите ваш пароль для подтверждения:");
          if (!password) return;

          try {
            const res = await fetch("/api/auth/delete/" + YOUR_USER_ID_HERE, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + YOUR_JWT_TOKEN_HERE
              },
              body: JSON.stringify({ password })
            });

            const data = await res.json();
            if (res.ok) {
              response.textContent = data.message || "Ваши данные успешно удалены.";
            } else {
              response.style.color = "red";
              response.textContent = data.message || "Ошибка при удалении данных.";
            }
          } catch (err) {
            response.style.color = "red";
            response.textContent = "Ошибка сервера.";
          }
        });
      </script>
    </body>
    </html>
  `);
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
