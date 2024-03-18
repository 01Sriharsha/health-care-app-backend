import { Specality } from "../models/specalitites.model.js";
import { ApiError, ApiSuccess } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { validateObject } from "../util/validateObject.js";

export const addSpecality = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const { error } = validateObject({ name, description });

  if (error) {
    return ApiError(res, 400, error);
  }

  const existingSpecality = await Specality.findOne({ name });

  if (existingSpecality) {
    return ApiError(res, 400, "Specality already exists!");
  }

  const specality = await Specality.create({
    name,
    description,
  });

  return ApiSuccess(res, 201, {
    message: "Specality added successfully",
    specality,
  });
});

export const removeSpecality = asyncHandler(async (req, res) => {
  const specalityId = req.params.id;

  if (!specalityId) {
    return ApiError(res, 400, "Invalid Specality Id");
  }

  const specality = await Specality.findById({ _id: specalityId });

  if (!specality) {
    return ApiError(res, 400, "Specality not found");
  }

  const deleted = await Specality.deleteOne({ _id: specalityId });

  if (!deleted) {
    return ApiError(res, 500, "Specality not found");
  }

  return ApiSuccess(res, 200, {
    message: "Specality removed successfully",
  });
});
