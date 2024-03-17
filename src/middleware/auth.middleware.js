import { User } from "../models/user.model.js";
import { ApiError } from "../util/ApiResponse";
import { asyncHandler } from "../util/asyncHandler.js";
import { verify } from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return ApiError(res, 403, "Token is Missing");
    }

    const decodedToken = await verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("decodedToken", decodedToken);

    if (!decodedToken.payload.id) {
      return ApiError(res, 403, "Invalid Token");
    }
    const user = await User.findById(decodedToken.payload.id);
    req.user = user;
    console.log("user", user);
    next();
  } catch (error) {
    return ApiError(res, 401, error?.message || "Invalid token");
  }
});
