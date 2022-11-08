import express from "express";
import moderationRouter from "./moderation.js";
import communitiesRouter from "./communities.js";
import signupRouter from "./signup.js";
import loginRouter from "./login.js";
import postRouter from "./posts.js";
import subredditRouter from "./subreddit.js";
// eslint-disable-next-line new-cap
const mainRouter = express.Router();

mainRouter.use(communitiesRouter);
mainRouter.use(signupRouter);
mainRouter.use(loginRouter);
mainRouter.use(moderationRouter);
mainRouter.use(postRouter);
mainRouter.use(subredditRouter);

export default mainRouter;
