import express from "express";
import loginRouter from "./login.js";

// eslint-disable-next-line new-cap
const routes = express.Router();

routes.use("/api", loginRouter);

export default routes;
