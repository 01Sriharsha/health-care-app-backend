import mongoose from "mongoose";

const specalityModel = new mongoose.Schema({
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
  //A specality can have multiple doctors
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Specality = mongoose.model("Specality", specalityModel);
