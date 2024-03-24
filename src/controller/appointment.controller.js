import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";
import { WorkDetails } from "../models/workdetails.model.js";
import { ApiError, ApiSuccess } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { validateObject } from "../util/validateObject.js";

// Creating new Appointment
export const createAppointment = async (req, res) => {
  try {
    const { datetime, patient, doctor, mode, type, description } = req.body;

    const { error } = validateObject({
      datetime,
      patient,
      doctor,
      mode,
      type,
      description,
    });

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

    const dateTime = new Date(datetime);
    // Check specialist availability
    const existingAppointment = await Appointment.findOne({ dateTime, doctor });
    if (existingAppointment) {
      return ApiError(
        res,
        400,
        "Appointment slot is already booked for this specialist."
      );
    }

    // If specialist is available, create new appointment
    const appointment = await Appointment.create({
      type,
      datetime: dateTime,
      patient,
      doctor,
      mode,
      description,
    });
    return ApiSuccess(res, 201, {
      message: "Appointment booked successfully!",
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
    const exclude = "-createdAt -updatedAt -__v -password";
    const response = await Appointment.find().select(exclude);

    const appointments = getAppointmentsArray(response);

    return ApiSuccess(res, 200, {
      data: appointments,
    });
  } catch (error) {
    return ApiError(res, 500, error.message);
  }
};

export const getPatientAppointments = asyncHandler(async (req, res) => {
  try {
    const exclude = "-createdAt -updatedAt -__v -password";
    const id = req.params.id;

    if (!id) {
      return ApiError(res, 400, "Missing params patient id");
    }

    const response = await Appointment.find({ patient: id }).select(exclude);

    const appointments = await getAppointmentsArray(response);

    return ApiSuccess(res, 200, {
      data: appointments,
    });
  } catch (error) {
    return ApiError(res, 500, error.message);
  }
});

export const getDoctorAppointments = asyncHandler(async (req, res) => {
  try {
    const exclude = "-createdAt -updatedAt -__v -password";
    const id = req.params.id;

    if (!id) {
      return ApiError(res, 400, "Missing params patient id");
    }

    const response = await Appointment.find({ doctor: id }).select(exclude);

    const appointments = await getAppointmentsArray(response);

    return ApiSuccess(res, 200, {
      data: appointments,
    });
  } catch (error) {
    return ApiError(res, 500, error.message);
  }
});

const getAppointmentsArray = async (appointmentsArray) => {
  const exclude = "-createdAt -updatedAt -__v -password";
  const appointments = [];
  for (let i = 0; i < appointmentsArray.length; i++) {
    let app = appointmentsArray[i];
    let patient = await User.findById(app.patient).select(exclude);
    let doctor = await User.findById(app.doctor).select(exclude);
    let workDetails = await WorkDetails.findOne({
      doctor: app.doctor,
    }).select(exclude);
    doctor = { ...doctor._doc, workDetails };
    app = { ...app._doc, patient: patient._doc, doctor };
    appointments.push(app);
  }

  return appointments;
};
