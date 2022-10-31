import express from "express";
import moderationRouter from "./moderation";

const mainRouter = express.Router();

mainRouter.use("/api", moderationRouter);

export default mainRouter;
