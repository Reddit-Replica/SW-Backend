import express from "express";
import moderationRouter from "./moderation.js";
import signupRouter from "./signup.js";
import loginRouter from "./login.js";
import commentsRouter from "./comments.js";

// eslint-disable-next-line new-cap
const mainRouter = express.Router();

mainRouter.use(signupRouter);
mainRouter.use(loginRouter);
mainRouter.use(commentsRouter);

export default mainRouter;
