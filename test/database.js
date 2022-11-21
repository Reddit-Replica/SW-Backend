import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DB_URL = process.env.MONGO_URL_TESTING.trim();

export function connectDatabase() {
  mongoose
    .connect(DB_URL, { useNewUrlParser: true })
    .then(() => {
      console.log("connected to mongo nnew version");
    })
    .catch((error) => {
      console.log("unable to connect to mongoDB : ", error);
    });
}

export function closeDatabaseConnection() {
  mongoose.connection.close();
}
