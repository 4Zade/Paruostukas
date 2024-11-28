import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI || "";

export default async function runDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("[\x1b[34mMongoose\x1b[0m] Database started successfully");
  } catch (err: unknown) {
    console.log("[\x1b[34mMongoose\x1b[0m] Error: ", err);
  }
}
