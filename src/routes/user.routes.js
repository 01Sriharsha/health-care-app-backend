import { Router } from "express";
import { getAllDoctors } from "../controller/user.controller.js";

const router = Router();

router.route("/doctors").get(getAllDoctors);

export const userRouter = router;
