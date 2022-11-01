import express from "express";
import moderationRouter from "./moderation.js";

const mainRouter = express.Router();

mainRouter.use(moderationRouter);

export default mainRouter;
