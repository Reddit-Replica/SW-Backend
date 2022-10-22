import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import postCommentActionRoutes from "./routes/post-and-comment-actions.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import categoryRoutes from "./routes/categories.js";
import searchRoutes from "./routes/search.js";
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

app.use(postRoutes);
app.use(commentRoutes);
app.use(postCommentActionRoutes);
app.use(categoryRoutes);
app.use(searchRoutes);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
