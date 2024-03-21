import { Router } from "express";
import { getAllDoctors, updateUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/doctors").get(getAllDoctors);
router.route("/update/:userId").post(verifyJWT, updateUser);

export const userRouter = router;
