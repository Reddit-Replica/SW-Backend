import express from "express";
import signupRouter from "./signup.js";

// eslint-disable-next-line new-cap
const mainRouter = express.Router();

mainRouter.use(signupRouter);

export default mainRouter;
