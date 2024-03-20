import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return ApiError(res, 403, "Token is Missing");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken?.id) {
      return ApiError(res, 403, "Invalid Token");
    }

    //Check for user
    let user = await User.findById({ _id: decodedToken.id }).select([
      "email",
      "role",
      "_id",
    ]);
    //Check for admin
    if (!user) {
      user = await Admin.findById({ _id: decodedToken.id }).select([
        "email",
        "role",
        "_id",
      ]);
    }

    if (!user) {
      return ApiError(res, 403, "Invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiError(res, 401, error?.message || "Invalid token");
  }
});
