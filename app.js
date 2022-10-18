import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

var monngoURL = "mongodb://mongo-service/database";

mongoose
  .connect(monngoURL, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to mongo");
  })
  .catch((error) => {
    console.log("unable to connect to mongoDB : ", error);
  });

app.get("/api", (req, res, next) => {
  const data = process.env.DATA_TO_SEND || "Data Added Automatically";
  res.json({
    text: data,
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
