import express from "express";
import moderationRouter from "./moderation.js";
import loginRouter from "./login.js";

// eslint-disable-next-line new-cap
const mainRouter = express.Router();

mainRouter.use(moderationRouter);

mainRouter.use(loginRouter);

export default mainRouter;
