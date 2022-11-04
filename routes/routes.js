import express from "express";
import moderationRouter from "./moderation.js";
import postRouter from "./posts.js";

// eslint-disable-next-line new-cap
const mainRouter = express.Router();

mainRouter.use(moderationRouter);

mainRouter.use(postRouter);

export default mainRouter;
