import mongoose from "mongoose";

//Pateint and Doctor both are users
const userModel = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["MALE" | "FEMALE"],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      min: 10,
      max: 10,
    },
    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR"],
      default: "PATIENT",
    },
    avatar: String,
    emailVerfied: Boolean,

    //User can have multiple symptoms
    symptoms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Symptoms",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//hash the password before saving to the database
userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  await hash(this.password, 10);
  next();
});

//Custom method to compare the hashed password to the incoming password from login page
userModel.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userModel);
