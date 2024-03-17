import { User } from "../models/user.model.js";
import { ApiError, ApiSuccess } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";

const COOKIE_NAME = "token";

const options = {
  httpOnly: true,
  path: "/",
  // secure: true,
};

export const handleOAuthLogin = asyncHandler(async (req, res, next) => {
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
});

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, phone, password, role, city, gender } = req.body;

  if (!fullname || !email || !phone || !password || !role || !city || !gender) {
    return ApiError(res, 400, "All fields are required!");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

  if (existingUser) {
    return ApiError(res, 400, "User already exists!");
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
    user: savedUser,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ApiError(res, 400, "Email and Password is required!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return ApiError(res, 401, "Email not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return ApiError(res, 401, "Invalid Password");
  }

  const token = await user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  res
    .status(200)
    .cookie(COOKIE_NAME, token, options)
    .json({
      message: `Welcome back ${user.fullname?.toUpperCase()}!`,
      user: loggedInUser,
    });
});

export const logoutUser = asyncHandler(async (req, res) => {
  req.logout();
  return res.status(200).clearCookie(COOKIE_NAME, options).json({
    message: "Logged Out Successfully",
  });
});
