import passport from "passport";
import { config } from "dotenv";
import { Strategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

config();

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      const obj = profile._json;
      let user;
      user = await User.findOne({ email: obj.email }).select([
        "_id",
        "email",
        "role",
        "avatar",
        "fullname",
      ]);
      if (!user) {
        user = await User.create({
          email: obj.email,
          avatar: obj.picture,
          fullname: obj.name,
          role: "PATIENT",
          emailVerfied: true,
          isOAuth: true,
          password: undefined, //password will be empty for oauth login
          phone : undefined
        });
      }
      cb(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
