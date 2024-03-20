import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

//Pateint and Doctor both are users
const userModel = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
    },
    city: {
      type: String,
    },
    phone: String,
    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR"],
      default: "PATIENT",
    },
    avatar: String,
    emailVerfied: Boolean,
    isOAuth: Boolean,

    //User can have multiple symptoms
    symptoms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Symptoms",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//hash the password before saving to the database
userModel.pre("save", async function (next) {
  if (!this.isModified("password") || this.isOAuth) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

//Custom method to compare the hashed password to the incoming password from login page
userModel.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userModel.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      email: this.email,
      id: this._id,
      role: this.role,
      avatar: this.avatar,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { algorithm: "HS512", expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userModel);
