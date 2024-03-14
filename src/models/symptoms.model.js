import mongoose from "mongoose";

const symptomsModel = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
  },
});

export const Symptoms = mongoose.model("Symptoms" , symptomsModel);
