import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const DBString = `${process.env.MONGO_URI}/health-care`;
    console.log(DBString);
    const connection = await mongoose.connect(DBString);
    console.log("MongoDB Connected..." , mongoose.connection.host);
  } catch (error) {
    console.log("DB ERR:", error.message);
    throw new Error("Failed to establish connection with the database");
  }
};