import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST,
  jwtSecret: process.env.SECRET_KEY,
  sessionSecret: process.env.SESSION_SECRET_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  frontendUrl: process.env.FRONTEND_URL,
  sendgridKey: process.env.SENDGRID_API_KEY,
  baseUrl: process.env.BASE_URL,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
};
