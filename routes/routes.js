import express from "express";
import moderationRouter from "./moderation.js";
import signupRouter from "./signup.js";
import loginRouter from "./login.js";
import commentsRouter from "./comments.js";
import postCommentMessageActionsRouter from "./poComMesActions.js";

// eslint-disable-next-line new-cap
const mainRouter = express.Router();

mainRouter.use(signupRouter);
mainRouter.use(loginRouter);
mainRouter.use(commentsRouter);
mainRouter.use(postCommentMessageActionsRouter);

export default mainRouter;
