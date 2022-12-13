import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import mainRouter from "./routes/routes.js";
import bodyParser from "body-parser";
import morgan from "morgan";
import { fileStorage, fileFilter } from "./utils/files.js";
const app = express();

dotenv.config();

app.use(bodyParser.json());
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).fields([
    { name: "images", maxCount: 100 },
    { name: "video", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ])
);

// That's morgan for tracking the api in the terminal
// Will be removed later
app.use(morgan("dev"));

// Log stream for morgan to make the log file in the server
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs/access.log"),
  {
    flags: "a",
  }
);

app.use(
  morgan("combined", {
    stream: accessLogStream,
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/videos", express.static(path.join(__dirname, "videos")));

const port = process.env.PORT || 3000;

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

// app.use(cors());

let DB_URL;
// eslint-disable-next-line max-len
if (process.env.NODE_ENV.trim() === "testing") {
  DB_URL = process.env.MONGO_URL_TESTING.trim();
} else {
  DB_URL = process.env.MONGO_URL.trim();
}

mongoose
  .connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to mongo nnew version");
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

export default app;
