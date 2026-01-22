import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wanderlust",
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
  }
};
export default connectDB;
