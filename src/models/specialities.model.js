import mongoose from "mongoose";

const specialityModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  //A speciality can have multiple doctors
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Speciality = mongoose.model("Speciality", specialityModel);
