import express from "express";
import { validateRequestSchema } from "../middleware/validationResult.js";
import loginController from "../controllers/loginController.js";

// eslint-disable-next-line new-cap
const loginRouter = express.Router();

/**
 * @swagger
 * /login/forget-username:
 *   post:
 *     summary: Forget username, used to send an email with the username inside it
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email to send the username to
 *     responses:
 *       200:
 *         description: Email has been sent
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       500:
 *         description: Internal server error
 */
loginRouter.post(
  "/login/forget-username",
  loginController.forgetUsernameValidator,
  validateRequestSchema,
  loginController.forgetUsername
);

loginRouter.post("/login/forget-username");

export default loginRouter;
