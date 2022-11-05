import express from "express";
import moderationRouter from "./moderation.js";
import communitiesRouter from "./communities.js";

// eslint-disable-next-line new-cap
const mainRouter = express.Router();

mainRouter.use(communitiesRouter);

export default mainRouter;
