import { hash } from "bcryptjs";
import mongoose from "mongoose";

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
});

//hash the password before saving to the database
adminModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  await hash(this.password, 10);
  next();
});

//Custom method to compare the hashed password to the incoming password from login page
adminModel.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const Admin = mongoose.model("Admin", adminModel);
