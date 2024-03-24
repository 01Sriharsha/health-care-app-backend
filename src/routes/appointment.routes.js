import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
  getAllAppointments,
  searchAppointmentsByPatientFullName,
  getPatientAppointments,
  getDoctorAppointments,
} from "../controller/appointment.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createAppointment);
router.route("/delete/:id").delete(deleteAppointment);
router.route("/update/:id").put(updateAppointment);
router.route("/getAllAppointments").get(getAllAppointments);
router.route("/get/patient/:id").get(verifyJWT, getPatientAppointments);
router.route("/get/doctor/:id").get(verifyJWT, getDoctorAppointments);
router
  .route("/searchAppointmentsByPatientFullName")
  .get(searchAppointmentsByPatientFullName);

export const appointmentRouter = router;
