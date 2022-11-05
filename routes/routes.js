import express from "express";
import signupRouter from "./signup.js";
import loginRouter from "./login.js";

// eslint-disable-next-line new-cap
const mainRouter = express.Router();

mainRouter.use(signupRouter);
mainRouter.use(loginRouter);

export default mainRouter;
