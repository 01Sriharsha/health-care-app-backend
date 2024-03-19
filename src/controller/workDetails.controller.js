import { User } from "../models/user.model.js";
import { WorkDetails } from "../models/workdetails.model.js";
import { ApiError, ApiSuccess } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { validateObject } from "../util/validateObject.js";

export const addDoctorWorkDetails = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return ApiError(res, 403, "Invalid token");
    }

    if (req.user.role === "PATIENT") {
      return ApiError(res, 401, "Unauthorized");
    }

    const doctorId = req.params.doctorId;

    const {
      registrationId,
      workingTime,
      currentWorkPlace,
      qualification,
      specialities,
    } = req.body;

    const { error } = validateObject({
      doctorId,
      registrationId,
      workingTime,
      currentWorkPlace,
      qualification,
      specialities,
    });

    if (error) {
      return ApiError(res, 400, error);
    }

    const doctor = await User.findOne({
      $and: [{ _id: doctorId }, { role: "DOCTOR" }],
    }).select("-password");

    if (!doctor) {
      return ApiError(res, 400, "Doctor not found");
    }

    const workDetails = await WorkDetails.create({
      doctor: doctor._id,
      registrationId,
      currentWorkPlace,
      qualification,
      workingTime,
      specialities,
    });

    const { _doc, ...unwanted } = doctor;

    const user = { ..._doc, workDetails };

    return ApiSuccess(res, 201, {
      message: "Work Details added successfully!",
      data: user,
    });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});

export const updateDoctorWorkDetails = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return ApiError(res, 403, "Invalid token");
    }

    const doctorId = req.params.doctorId;

    if (!doctorId) {
      return ApiError(res, 400, "Missing params doctor id");
    }

    const { workingTime, specialities, currentWorkPlace, qualification } =
      req.body;

    //Do not validate object as user can update any one of them

    const workDetails = await WorkDetails.findOne({ doctor: doctorId });

    if (!workDetails) {
      return ApiError(res, 404, "Doctor work details not found");
    }

    const updatedDetails = await WorkDetails.findByIdAndUpdate(
      workDetails._id,
      {
        workingTime,
        currentWorkPlace,
        qualification,
        specialities,
      }
    );

    if (!updatedDetails) {
      return ApiError(res, 500, "Failed to update the work details");
    }

    return ApiSuccess(res, 200, {
      message: "Work details updated successfully",
      data: updatedDetails,
    });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});
