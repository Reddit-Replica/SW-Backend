import express from "express";
import moderationRouter from "./moderation.js";
import communitiesRouter from "./communities.js";
import signupRouter from "./signup.js";
import loginRouter from "./login.js";
import commentsRouter from "./comments.js";
import itemsActionsRouter from "./itemsActions.js";
import postActionsRouter from "./postActions.js";
import postRouter from "./posts.js";
import subredditRouter from "./subreddit.js";
import subredditRulesRouter from "./subredditRules.js";
import messageRouter from "./message.js";
import subredditFlairsRouter from "./subredditFlairs.js";
// eslint-disable-next-line new-cap
const mainRouter = express.Router();

mainRouter.use(communitiesRouter);
mainRouter.use(signupRouter);
mainRouter.use(loginRouter);
mainRouter.use(commentsRouter);
mainRouter.use(itemsActionsRouter);
mainRouter.use(postActionsRouter);
mainRouter.use(moderationRouter);
mainRouter.use(postRouter);
mainRouter.use(subredditRouter);
mainRouter.use(subredditRulesRouter);
mainRouter.use(messageRouter);
mainRouter.use(subredditFlairsRouter);

export default mainRouter;
