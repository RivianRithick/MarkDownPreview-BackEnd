import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoDBURL = process.env.MONGODBCONNECTIONSTRING;

const ConnectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoDBURL);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

export default ConnectDB;
