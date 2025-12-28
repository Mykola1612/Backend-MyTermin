import { env } from "./env.js";
import passport from "passport";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { nanoid } from "nanoid";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { HttpError } from "../helpers/HttpError.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      if (!profile._json.email_verified) {
        return cb(HttpError(400, "Email not verified by Google"));
      }

      try {
        const user = await User.findOne({ email: profile._json.email });
        if (user) {
          return cb(HttpError(409));
        }

        const password = await bcrypt.hash(nanoid(), 10);
        const newUser = await User.create({
          name: profile._json.name,
          email: profile._json.email,
          password,
        });
        console.log("User Add");

        return cb(null, newUser);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});
