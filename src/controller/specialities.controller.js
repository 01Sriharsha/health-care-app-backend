import { Speciality } from "../models/specialities.model.js";
import { User } from "../models/user.model.js";
import { WorkDetails } from "../models/workdetails.model.js";
import { ApiError, ApiSuccess } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { validateObject } from "../util/validateObject.js";

export const addSpeciality = asyncHandler(async (req, res) => {
  if (!req.user) {
    return ApiError(res, 403, "Invalid token");
  }

  if (req.user.role !== "ADMIN") {
    return ApiError(res, 401, "Unauthorized");
  }

  const { name, description, possibleSymptoms, term } = req.body;

  const { error } = validateObject({
    name,
    description,
    possibleSymptoms,
    term,
  });

  if (error) {
    return ApiError(res, 400, error);
  }

  const existingSpeciality = await Speciality.findOne({ name });

  if (existingSpeciality) {
    return ApiError(res, 400, "Speciality already exists!");
  }

  const speciality = await Speciality.create({
    name,
    description,
    possibleSymptoms,
    term,
  });

  return ApiSuccess(res, 201, {
    message: "Speciality added successfully",
    data: speciality,
  });
});

export const removeSpeciality = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return ApiError(res, 403, "Invalid token");
    }

    if (req.user.role !== "ADMIN") {
      return ApiError(res, 401, "Unauthorized");
    }

    const specialityId = req.params.specialityId;

    if (!specialityId) {
      return ApiError(res, 400, "Invalid Speciality Id");
    }

    const deleted = await Speciality.findByIdAndDelete(specialityId);

    if (!deleted) {
      return ApiError(res, 404, "Speciality not found");
    }

    return ApiSuccess(res, 200, {
      message: "Speciality removed successfully",
    });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});

export const updateSpecality = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return ApiError(res, 403, "Invalid token");
    }

    const specialityId = req.params.specialityId;

    const { name, description, term, possibleSymptoms } = req.body;

    const { error } = validateObject({
      specialityId,
      name,
      description,
      term,
      possibleSymptoms,
    });

    if (error) {
      return ApiError(res, 400, error);
    }

    const speciality = await Speciality.findByIdAndUpdate(specialityId, {
      name,
      description,
      term,
      possibleSymptoms,
    });

    if (!speciality) {
      return ApiError(res, 404, "Speciality Not Found");
    }

    return ApiSuccess(res, 201, {
      message: "Speciality updated successfully",
      data: speciality,
    });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});

export const getAllSpecialities = asyncHandler(async (req, res) => {
  try {
    const specialities = await Speciality.find();
    return ApiSuccess(res, 200, {
      data: specialities,
    });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});

export const getAllDoctorsBySpec = asyncHandler(async (req, res) => {
  try {
    const spec = req.params.spec;
    if (!spec) {
      return ApiError(res, 400, "Spec param is missing");
    }
    const speciality = await Speciality.findOne({ name: spec });

    if (!speciality) {
      return ApiError(res, 404, "Speciality not found");
    }

    // const doctors = await WorkDetails.find({ specialities: speciality._id });

    const doctors = await User.aggregate([
      { $match: { role: "DOCTOR" } },
      {
        $lookup: {
          from: "workdetails",
          localField: "_id", // Field in the User
          foreignField: "doctor", // Field in the WorkDetails
          as: "workDetails",
        },
      },
      { $unwind: "$workDetails" }, // Unwind the array
      { $match: { "workDetails.specialities": speciality._id } },
      {
        $project: {
          password: 0,
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
