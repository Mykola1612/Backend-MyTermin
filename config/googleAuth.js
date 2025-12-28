import "dotenv/config";
import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export const setupGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(null, user);
        //   });
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });
};
