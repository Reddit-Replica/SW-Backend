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
import userRouter from "./user.js";
import categoryRouter from "./categories.js";
import subredditFlairsRouter from "./subredditFlairs.js";
import messageRouter from "./message.js";
import subredditModerationsRouter from "./subredditModeration.js";
import userSettingsRouter from "./userSettings.js";
import postAndCommentActionsRouter from "./post-and-comment-actions.js";
import commentActionsRouter from "./comment-action.js";
import searchRouter from "./search.js";
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
mainRouter.use(userRouter);
mainRouter.use(subredditRouter);
mainRouter.use(subredditRulesRouter);
mainRouter.use(categoryRouter);
mainRouter.use(subredditFlairsRouter);
mainRouter.use(userSettingsRouter);
mainRouter.use(messageRouter);
mainRouter.use(subredditModerationsRouter);
mainRouter.use(postAndCommentActionsRouter);
mainRouter.use(commentActionsRouter);
mainRouter.use(searchRouter);

// ! should add your router before this middleware
mainRouter.use((req, res) => {
  res.status(404).json(`Can't ${req.method} ${req.url}`);
});

export default mainRouter;
