import { Router } from "express";
import passport from "passport";
import {
  handleOAuthLogin,
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/auth.controller.js";

const router = Router();

//Google Login
router
  .route("/google/callback")
  .get(passport.authenticate("google", { session: false }), handleOAuthLogin);

//Credentials Login
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

//Logout user
router.route("/logout").get(logoutUser);

export const authRouter = router;
