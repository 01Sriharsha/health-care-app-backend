import { Speciality } from "../models/specialities.model.js";
import { User } from "../models/user.model.js";
import { WorkDetails } from "../models/workdetails.model.js";
import { ApiError, ApiSuccess } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";

export const getAllDoctors = asyncHandler(async (req, res) => {
  try {
    const doctors = await User.aggregate([
      {
        $match: { role: "DOCTOR" },
      },
      {
        $lookup: {
          from: "workdetails",
          localField: "_id",
          foreignField: "doctor",
          as: "workDetails",
        },
      },
      {
        $addFields: {
          workDetails: { $arrayElemAt: ["$workDetails", 0] },
        },
      },
      {
        $project: {
          password: 0, // Exclude the password field,
          workDetails: {
            doctor: 0,
          },
        },
      },
    ]);
    return ApiSuccess(res, 200, {
      data: doctors,
    });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return ApiError(res, 403, "Invalid token");
    }
    const userId = req.params.userId;

    const { avatar, city, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, {
      avatar,
      city,
      phone,
    }).select("-password");

    if (!updatedUser) {
      return ApiError(res, 500, "Failed to update details");
    }

    return ApiSuccess(res, 200, {
      message: "Updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});

export const getDoctor = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.params.id;

    const doctor = await User.findOne({
      $and: [{ _id: doctorId }, { role: "DOCTOR" }],
    }).select("-password");

    if (!doctor) return ApiError(res, 404, "Doctor not found");

    const workDetails = await WorkDetails.findOne({ doctor: doctor._id });

    if (!doctor) return ApiError(res, 404, "Doctor's Work details not found");

    const specialities = [];
    for (let i = 0; i < workDetails.specialities.length; i++) {
      const specs = workDetails.specialities;
      const speciality = await Speciality.findById(specs[i]);
      specialities.push(speciality);
    }

    workDetails.specialities = specialities;

    const { _doc, ...unwanted } = doctor;

    const user = { ..._doc, workDetails };

    return ApiSuccess(res, 200, {
      data: user,
    });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});
