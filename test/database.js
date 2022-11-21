import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DB_URL = process.env.MONGO_URL_TESTING.trim();

export async function connectDatabase() {
  try {
    await mongoose.connect(DB_URL, { useNewUrlParser: true });
  } catch (err) {
    console.log(err);
  }
}

export function closeDatabaseConnection() {
  mongoose.connection.close();
}
