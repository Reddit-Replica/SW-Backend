import express from "express";
import moderationRouter from "./moderation.js";
import loginRouter from "./login.js";

const mainRouter = express.Router();

mainRouter.use(moderationRouter);

mainRouter.use(loginRouter);

export default mainRouter;
