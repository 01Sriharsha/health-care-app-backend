import { Router } from "express";
import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
  getAllAppointments,
  searchAppointmentsByPatientFullName,
} from "../controller/appointment.controller.js";

const router = Router();

router.route("/createAppointment").post(createAppointment);
router.route("/deleteAppointment/:id").delete(deleteAppointment);
router.route("/updateAppointment/:id").put(updateAppointment);
router.route("/getAllAppointments").get(getAllAppointments);
router
  .route("/searchAppointmentsByPatientFullName")
  .get(searchAppointmentsByPatientFullName);

export const appointmentRouter = router;
