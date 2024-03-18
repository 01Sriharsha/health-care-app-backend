import { Admin } from "../models/admin.model.js";
import { WorkDetails } from "../models/workdetails.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { ApiError, ApiSuccess } from "../util/ApiResponse.js";

export const registerAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const key = !email ? "email" : "password";
      return ApiError(res, 400, `${key} is required`);
    }

    const existingAdmin = await Admin.findOne({ email }).select("-password");

    if (existingAdmin) {
      return ApiError(res, 401, "Admin already exists!");
    }

    const admin = await Admin.create({ email, password });

    if (!admin) {
      return ApiError(res, 500, "Failed to create an admin");
    }

    return ApiSuccess(res, 201, { admin });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});

//Protected Route
export const verifyDoctor = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return ApiError(res, 403, "Invalid Token");
    }

    const doctorId = req.params.doctorId;

    if (!doctorId) {
      return ApiError(res, 400, "Doctor Id is missing in the params!");
    }

    const doctor = await User.findOne({
      $and: [{ _id: doctorId }, { role: "DOCTOR" }],
    });

    if (!doctor) {
      return ApiError(res, 400, "Doctor not found");
    }

    const workDetails = await WorkDetails.findOne({ doctor: doctor._id });

    if (!workDetails) {
      return ApiError(res, 400, "Doctor work details not found");
    }

    const updated = await WorkDetails.updateOne({
      isVerified: true,
    });

    if (!updated) {
      return ApiError(res, 500, "Failed to verify the doctor!");
    }

    doctor.workDetails = workDetails;

    return ApiSuccess(res, 201, {
      message: "Doctor verified successfully",
      user: doctor,
    });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});
