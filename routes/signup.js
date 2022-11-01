import express from "express";
import { validateRequestSchema } from "../middleware/validationResult.js";
import signupController from "../controllers/signupController.js";
// eslint-disable-next-line new-cap
const signupRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sign Up
 *   description: Sign Up and email verfication endpoints
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new account to the user
 *     tags: [Sign Up]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - username
 *               - email
 *               - password
 *               - ReCAPTCHAs
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               username:
 *                 type: string
 *                 description: Username
 *               password:
 *                 type: string
 *                 description: Password
 *               ReCAPTCHAs:
 *                 type: string
 *                 description: ReCAPTCHAs response
 *     responses:
 *       201:
 *         description: The account has been successfully created
 *         headers:
 *           Authorization:
 *             description: The jwt that will be used for authorization
 *             schema:
 *               type: string
 *       400:
 *         description: The request was invalid. You may refer to response for
 *                      details around why the request was invalid
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
signupRouter.post(
  "/signup",
  signupController.signupValidator,
  validateRequestSchema,
  signupController.signup
);

export default signupRouter;