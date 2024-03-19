import { Speciality } from "../models/specialities.model.js";
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

  const { name, description } = req.body;

  const { error } = validateObject({ name, description });

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

    const { name, description } = req.body;

    const { error } = validateObject({ specialityId, name, description });

    if (error) {
      return ApiError(res, 400, error);
    }

    const speciality = await Speciality.findByIdAndUpdate(specialityId, {
      name,
      description,
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