import mongoose from "mongoose";

const specialityModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  term: String, //term commonly used for a practitioner specializing in particular specialty
  description: {
    type: String,
    required: true,
  },
  possibleSymptoms: [String], // list of symptom names that can be related to this disease/specialty
  image : String
});

export const Speciality = mongoose.model("Speciality", specialityModel);
