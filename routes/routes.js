import express from "express";
import moderationRouter from "./moderation.js";

// eslint-disable-next-line new-cap
const mainRouter = express.Router();

mainRouter.use(moderationRouter);

export default mainRouter;
