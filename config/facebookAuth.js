import { env } from "./env.js";
import passport from "passport";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { nanoid } from "nanoid";

import { Strategy as FacebookStrategy } from "passport-facebook";
import { HttpError } from "../helpers/index.js";

passport.use(
  new FacebookStrategy(
    {
      clientID: env.facebookClientId,
      clientSecret: env.facebookClientSecret,
      callbackURL: `${env.baseUrl}/api/auth/facebook/callback`,
      profileFields: ["displayName", "photos", "email"],
    },

    async function (accessToken, refreshToken, profile, cb) {
      const email = profile._json.email;

      if (!email) {
        return cb(HttpError(400, "Facebook account has no email"));
      }

      try {
        const user = await User.findOne({ email });
        if (user) {
          return cb(null, user);
        }

        const password = await bcrypt.hash(nanoid(), 14);
        const newUser = await User.create({
          name: profile._json.name,
          email,
          verify: true,
          password,
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
