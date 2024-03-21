import mongoose from "mongoose";

const appointmentModel = new mongoose.Schema(
  {
    datetime: Date,
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"],
      default: "PENDING",
    },
    symptoms: [String],
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
    mode: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      default: "OFFLINE",
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentModel);
