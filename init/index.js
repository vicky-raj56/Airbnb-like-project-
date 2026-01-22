import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({path:"../.env"});
import initData from "./data.js";
import listingModel from "../models/listing.model.js";

// const MONGO_URI = "mongodb://127.0.0.1:27017/wanderlust";



const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
  }
};
connectDB();

const initDB = async () => {
      try{
  await listingModel.deleteMany({});
  await listingModel.insertMany(initData.data);
  console.log("data was initialized");
      }catch(error){
        console.log("data initialization failed", error.message);
      }
};

initDB();
