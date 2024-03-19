import mongoose from "mongoose";

const WorkDetailsModel = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    registrationId: {
      type: String,
      required: true,
      unique: true,
    },
    workingTime: {
      type: String,
      required: true,
    },
    currentWorkPlace: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    //A doctor can be multi-specalist
    specialities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Speciality",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const WorkDetails = mongoose.model("WorkDetails", WorkDetailsModel);
