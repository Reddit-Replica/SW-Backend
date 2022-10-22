import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import messageRouter from "./routes/message.js";
import categoriesRouter from "./routes/communities.js";
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

// mongoose
//   .connect(monngoURL, { useNewUrlParser: true })
//   .then(() => {
//     console.log("connected to mongo");
//   })
//   .catch((error) => {
//     console.log("unable to connect to mongoDB : ", error);
//   });

app.get("/api", (req, res, next) => {
  const data = process.env.DATA_TO_SEND || "Data Added Automatically";
  res.json({
    text: data,
  });
});

// swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Read-it",
      version: "1.0.0",
      description: "API-Documentation",
    },
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/api",messageRouter);
app.use("/api",categoriesRouter);
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
