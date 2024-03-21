import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addSpeciality,
  getAllDoctorsBySpec,
  getAllSpecialities,
  removeSpeciality,
  updateSpecality,
} from "../controller/specialities.controller.js";

const router = Router();

router.route("/").get(getAllSpecialities);
router.route("/getDoctors/:spec").get(getAllDoctorsBySpec);
router.route("/add").post(verifyJWT, addSpeciality);
router.route("/remove/:specialityId").post(verifyJWT, removeSpeciality);
router.route("/update/:specialityId").post(verifyJWT, updateSpecality);

export const specialitiesRouter = router;
