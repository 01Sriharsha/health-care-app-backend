import { User } from "../models/user.model.js";
import { ApiSuccess } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";

export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.aggregate([
    {
      $match: { role: "DOCTOR" },
    },
    {
      $lookup: {
        from: "WorkDetails",
        localField: "_id",
        foreignField: "doctor",
        as: "workDetails",
      },
    },
  ]);
  return ApiSuccess(res, 200, {
    data: doctors,
  });
});
