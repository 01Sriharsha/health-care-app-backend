import mongoose from "mongoose";

const reviewModel = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: [1, "Minimum rating is 1"],
    max: [5, "Maximum rating is 5"],
  },
  comment: {
    type: String,
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Review = mongoose.model("Review", reviewModel);
