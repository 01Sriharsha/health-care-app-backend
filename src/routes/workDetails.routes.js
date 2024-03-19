import { Router } from "express";
import {
  addDoctorWorkDetails,
  updateDoctorWorkDetails,
} from "../controller/workDetails.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

//doctor routes
router.route("/add/:doctorId").post(verifyJWT, addDoctorWorkDetails);
router.route("/update/:doctorId").post(verifyJWT, updateDoctorWorkDetails);

export const workDetailsRouter = router;
