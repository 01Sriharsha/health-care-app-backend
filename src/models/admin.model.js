import bcyptjs from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"

const adminModel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "ADMIN",
  },
});

//hash the password before saving to the database
adminModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcyptjs.hash(this.password, 10);
  next();
});

//Custom method to compare the hashed password to the incoming password from login page
adminModel.methods.isPasswordCorrect = async function (password) {
  return await bcyptjs.compare(password, this.password);
};

adminModel.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      email: this.email,
      id: this._id,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { algorithm: "HS512", expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const Admin = mongoose.model("Admin", adminModel);
