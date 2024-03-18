import { Router } from "express";
import { registerAdmin } from "../controller/admin.controller.js";

const router = Router();

router.route("/register").post(registerAdmin);

export const adminRouter = router;
