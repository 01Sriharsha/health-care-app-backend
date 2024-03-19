import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { validateObject } from "../util/validateObject.js";

const COOKIE_NAME = "token";

const options = {
  httpOnly: true,
  path: "/",
  secure: true,
};

export const handleOAuthLogin = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.id) {
      const user = await User.findById({ _id: req.user.id });
      if (!user) {
        return ApiError(res, 401, "User not found");
      }
      const token = await user.generateAccessToken();
      return res.cookie("token", token, { httpOnly: true, path: "/" }).json({
        success: true,
        message: "User logged successfully",
        user,
      });
    } else {
      return ApiError(res, 401, "Failed to login");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullname, email, phone, password, role, city, gender } = req.body;

    const { error } = validateObject({
      fullname,
      email,
      phone,
      password,
      role,
      city,
      gender,
    });

    if (error) {
      return ApiError(res, 400, error);
    }

    //Check if email matches with admin
    const isAdmin = await Admin.findOne({ email });

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (isAdmin || existingUser) {
      return ApiError(res, 400, "Email already exists!");
    }

    const user = await User.create({
      fullname,
      password,
      email,
      phone,
      city,
      gender,
      role,
      emailVerfied: false,
    }).catch((err) => ApiError(res, 400, err.message));

    const savedUser = await User.findById(user._id).select("-password");

    if (!savedUser) {
      return ApiError(res, 500, "Failed to create user!");
    }

    const token = await savedUser.generateAccessToken();

    return res.status(201).cookie(COOKIE_NAME, token, options).json({
      data: savedUser,
    });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = validateObject({ email, password });

    if (error) {
      return ApiError(res, 400, error);
    }

    //Check for user
    let user = await User.findOne({ email });

    //Check for admin
    if (!user) {
      user = await Admin.findOne({ email });
    }

    //Both not found throw error
    if (!user) {
      return ApiError(res, 401, "Email not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return ApiError(res, 401, "Invalid Password");
    }

    const token = await user.generateAccessToken();

    let loggedInUser;
    if (user.role === "ADMIN") {
      loggedInUser = await Admin.findById(user._id).select("-password"); // remove the password from response
    } else {
      loggedInUser = await User.findById(user._id).select("-password");
    }

    return res
      .status(200)
      .cookie(COOKIE_NAME, token, options)
      .json({
        message: `Welcome back ${
          user.role === "ADMIN" ? "ADMIN" : user.fullname?.toUpperCase()
        }!`,
        data: loggedInUser,
      });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    req.user = null;
    req.logout();
    return res
      .status(200)
      .clearCookie(COOKIE_NAME, { ...options, maxAge: -1 })
      .json({
        message: "Logged Out Successfully",
      });
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
});
