import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addSpecality,
  removeSpecality,
} from "../controller/specalities.controller.js";

const router = Router();

router.route("/add").post(verifyJWT, addSpecality);
router.route("/remove/:specalityId").post(verifyJWT, removeSpecality);

export const specalitiesRouter = router;
