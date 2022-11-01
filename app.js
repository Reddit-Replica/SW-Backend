import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import mainRouter from "./routes/routes.js";
import bodyParser from "body-parser";
import morgan from "morgan";
const app = express();

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

app.use(bodyParser.json());
app.use(morgan("dev"));

const port = process.env.PORT || 3000;

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

const DB_URL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

mongoose
  .connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to mongo");
  })
  .catch((error) => {
    console.log("unable to connect to mongoDB : ", error);
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

app.use(mainRouter);
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
