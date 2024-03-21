import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";
import { ApiError, ApiSuccess } from "../util/ApiResponse.js";
import { validateObject } from "../util/validateObject.js";

// Creating new Appointment
export const createAppointment = async (req, res) => {
  try {
    const { datetime, patient, doctor, mode } = req.body;

    const { error } = validateObject({ datetime, patient, doctor, mode });

    if (error) {
      return ApiError(res, 400, error);
    }

    // Check if patient exists
    const existingPatient = await User.findById(patient);
    if (!existingPatient) {
      return ApiError(res, 400, "Patient not found!");
    }

    // Check if doctor exists
    const existingDoctor = await User.findById(doctor);
    if (!existingDoctor) {
      return ApiError(res, 400, "Doctor not found!");
    }
    // Check specialist availability
    const existingAppointment = await Appointment.findOne({ datetime, doctor });
    if (existingAppointment) {
      return ApiError(
        res,
        400,
        "Appointment slot is already booked for this specialist."
      );
    }

    // If specialist is available, create new appointment
    const appointment = await Appointment.create({
      datetime,
      patient,
      doctor,
      mode,
    });
    return ApiSuccess(res, 201, {
      message: "Appointment successful",
      data: appointment,
    });
  } catch (error) {
    return ApiError(res, 500, error.message);
  }
};

// Deleting appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return ApiError(res, 404, "Appointment not found");
    }

    appointment.status = "CANCELED";
    await appointment.save();

    await Appointment.findByIdAndDelete(req.params.id);

    res.send(`Appointment deleted successfully`);
    return ApiSuccess(res, 200, appointment);
  } catch (error) {
    return ApiError(res, 500, error.message);
  }
};

// Updating Appointment as completed
export const updateAppointment = async (req, res) => {
  try {
    const { report } = req.body;

    if (!report) {
      return ApiError(res, 400, "Report is Required");
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        report,
        new: true,
        runValidators: true,
      }
    );

    if (!appointment) {
      return ApiError(res, 404, "Appointment not found");
    }

    appointment.status = "COMPLETED";
    await appointment.save();

    res.send("Appointment Updated Successfully");
    return ApiSuccess(res, 200, appointment);
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
      return ApiError(res, 404, "Patient not found");
    }

    // Perform the search query for appointments associated with the patient's ID
    let appointments = await Appointment.find({ patient: patient._id });
    appointments = await Appointment(patient._id);
    res.send("Search by fullName Successful");
    return ApiSuccess(res, 200, appointments);
  } catch (error) {
    return ApiError(res, 500, error.message);
  }
};

// Retrieving all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.send("Getting All Appointments");
    return ApiSuccess(res, 200, appointments);
  } catch (error) {
    return ApiError(res, 500, error.message);
  }
};
