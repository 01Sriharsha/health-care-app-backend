import mongoose from "mongoose";

const reportModel = new mongoose.Schema({
  disease: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  severity: {
    type: String,
    enum: ["HIGH", "MEDIUM", "LOW"],
    default: "LOW",
    required: true,
  },
  dateReported: {
    type: Date,
    default: Date.now(),
  },
  // add precscription
  prescription: [
    {
      medication: String,
      dosage: String,
    },
  ],
});

export const Report = mongoose.model("Report", reportModel);
