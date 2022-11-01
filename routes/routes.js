import express from "express";
import moderationRouter from "./moderation.js";

const mainRouter = express.Router();

mainRouter.use("/api", moderationRouter);

export default mainRouter;
