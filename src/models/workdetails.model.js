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
    //A doctor can be multi-specalist
    specialties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specality",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const WorkDetails = mongoose.model("WorkDetails", WorkDetailsModel);
