import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";

// Creating new Appointment
export const createAppointment = async (req, res) => {
  try {
    const { datetime, status, patient, doctor, report, mode } = req.body;

    const appointment = await Appointment.create({
      datetime,
      status,
      patient,
      doctor,
      report,
      mode,
    });
    res.status(201).json({
      success: true,
      message: "Appointment successful",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, ERROR: error.message });
  }
};

// Deleting appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, ERROR: error.message });
  }
};

// Updating Appointment
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.status(200).json({
      success: true,
      message: "Appointment Updated Successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, ERROR: error.message });
  }
};

// Search appointments by patient's fullname
export const searchAppointmentsByPatientFullName = async (req, res) => {
  try {
    const { fullname } = req.query;

    // Find the patient based on their fullname
    const patient = await User.findOne({ fullname });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    // Perform the search query for appointments associated with the patient's ID
    let appointments = await Appointment.find({ patient: patient._id });
    appointments = await Appointment(patient._id);

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Retrieving all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
