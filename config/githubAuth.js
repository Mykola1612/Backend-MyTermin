import { env } from "./env.js";
import passport from "passport";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { nanoid } from "nanoid";

import { Strategy as GitHubStrategy } from "passport-github2";
import { HttpError } from "../helpers/HttpError.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: env.githubClientId,
      clientSecret: env.githubClientSecret,
      callbackURL: `${env.baseUrl}/api/auth/github/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile);

      if (!profile._json.email_verified) {
        return cb(HttpError(400, "Email not verified by Google"));
      }

      try {
        const user = await User.findOne({ email: profile._json.email });
        if (user) {
          return cb(null, user);
        }

        const password = await bcrypt.hash(nanoid(), 14);
        const newUser = await User.create({
          name: profile._json.name,
          email: profile._json.email,
          password,
          verify: true,
        });

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
