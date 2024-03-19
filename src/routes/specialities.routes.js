import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addSpeciality,
  getAllSpecialities,
  removeSpeciality,
  updateSpecality,
} from "../controller/specialities.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getAllSpecialities);
router.route("/add").post(verifyJWT, addSpeciality);
router.route("/remove/:specialityId").post(verifyJWT, removeSpeciality);
router.route("/update/:specialityId").post(verifyJWT, updateSpecality);

export const specialitiesRouter = router;
