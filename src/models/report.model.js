import mongoose from "mongoose";

const reportModel = new mongoose.Schema({
  disease: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  serverity: {
    type: String,
    enum: ["HIGH", "MEDIUM", "LOW"],
    default: "LOW",
    required: true,
  },
  medication: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  
});

export const Report = mongoose.model("Report", reportModel);
