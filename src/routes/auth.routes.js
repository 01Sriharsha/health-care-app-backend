import { Router } from "express";
import passport from "passport";
import {
  fetchCurrentLoggedInUser,
  handleOAuthLogin,
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

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

//Fetch current logged in user
router.route("/me").get(verifyJWT, fetchCurrentLoggedInUser);

export const authRouter = router;
